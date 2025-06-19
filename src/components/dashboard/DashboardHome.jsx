import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { AlertCircle } from "lucide-react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function DashboardHome({ user }) {
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const [latestData, setLatestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, dataResponse] = await Promise.all([
          fetch("https://api.ocrapp.biz.id/users"),
          fetch("https://api.ocrapp.biz.id/data"),
        ]);
        const usersData = await usersResponse.json();
        const measurementData = await dataResponse.json();
        const sortedData = measurementData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setUsers(usersData);
        setData(measurementData);
        setLatestData(sortedData.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Insight berdasarkan latestData saja
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, dataResponse] = await Promise.all([
          fetch("https://api.ocrapp.biz.id/users"),
          fetch("https://api.ocrapp.biz.id/data"),
        ]);
        const usersData = await usersResponse.json();
        const measurementData = await dataResponse.json();
        const sortedData = measurementData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setUsers(usersData);
        setData(measurementData);
        setLatestData(sortedData.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (latestData.length === 0) return;

    const daerahMap = {};
    latestData.forEach((d) => {
      if (!daerahMap[d.daerah]) daerahMap[d.daerah] = [];
      daerahMap[d.daerah].push(d);
    });

    const result = [];
    Object.entries(daerahMap).forEach(([daerah, entries]) => {
      const kecamatanMap = {};

      entries.forEach((entry) => {
        const lowPower = entry.power <= 45;
        const lowMER = entry.mer <= 26;
        const lowCN = entry.cn <= 20.5;
        const lowLinkMargin = entry.linkMargin <= 3;

        if (lowPower || lowMER || lowCN || lowLinkMargin) {
          if (!kecamatanMap[entry.kecamatan]) {
            kecamatanMap[entry.kecamatan] = new Set();
          }
          if (lowPower) kecamatanMap[entry.kecamatan].add("Power rendah");
          if (lowMER) kecamatanMap[entry.kecamatan].add("MER rendah");
          if (lowCN) kecamatanMap[entry.kecamatan].add("C/N ratio rendah");
          if (lowLinkMargin)
            kecamatanMap[entry.kecamatan].add("Link Margin rendah");
        }
      });

      if (Object.keys(kecamatanMap).length > 0) {
        let message = `Masalah sinyal di daerah ${daerah}:
\n`;
        Object.entries(kecamatanMap).forEach(([kecamatan, issues]) => {
          message += `• ${kecamatan}: ${Array.from(issues).join(", ")}.\n`;
        });

        message +=
          `\nBerikan saran untuk tindak lanjut pekerja lapangan:\n` +
          `1. Periksa posisi antena agar tidak terhalang.\n` +
          `2. Arahkan ulang antena untuk hasil optimal.\n` +
          `3. Gunakan booster jika sinyal masih lemah.\n` +
          `4. Cek kondisi kabel dan pastikan tidak longgar.\n` +
          `5. Jauhkan kabel dari perangkat listrik.\n` +
          `6. Periksa perangkat penerima dari gangguan elektronik.\n`;

        result.push({
          daerah,
          message,
          type: "warning",
        });
      }
    });

    setInsights(result);
  }, [latestData]);

  const powerStats = {
    tinggi: data.filter((item) => item.power > 48).length,
    cukup: data.filter((item) => item.power >= 45 && item.power <= 48).length,
    rendah: data.filter((item) => item.power < 45).length,
  };

  const cnStats = {
    tinggi: data.filter((item) => item.cn > 21.5).length,
    cukup: data.filter((item) => item.cn >= 20.5 && item.cn <= 21.5).length,
    rendah: data.filter((item) => item.cn < 20.5).length,
  };

  const merStats = {
    tinggi: data.filter((item) => item.mer > 28).length,
    cukup: data.filter((item) => item.mer >= 26 && item.mer <= 28).length,
    rendah: data.filter((item) => item.mer < 26).length,
  };

  const linkMarginStats = {
    tinggi: data.filter((item) => item.linkMargin > 6).length,
    cukup: data.filter((item) => item.linkMargin >= 3 && item.linkMargin <= 6)
      .length,
    rendah: data.filter((item) => item.linkMargin < 3).length,
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label;
            const value = context.raw;
            return `${label}: ${value} data`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: {
          display: true,
          text: "Jumlah Data",
        },
      },
    },
  };

  const powerChartData = {
    labels: [
      "Baik (>48 dBµV/m)",
      "cukup (45–48 dBµV/m)",
      "Rendah (<45 dBµV/m)",
    ],
    datasets: [
      {
        label: "Jumlah Data",
        data: [powerStats.tinggi, powerStats.cukup, powerStats.rendah],
        backgroundColor: function (context) {
          const index = context.dataIndex;
          return ["#16a34a", "#2563eb", "#dc2626"][index]; // gradien dasar bisa dipakai nanti
        },
        hoverBackgroundColor: function (context) {
          const index = context.dataIndex;
          return ["#22c55e", "#3b82f6", "#ef4444"][index]; // hover lebih terang
        },
        borderRadius: 12,
        barThickness: 100,
        borderSkipped: false,
      },
    ],
  };

  const cnChartData = {
    labels: ["Baik (>21.5 dB)", "cukup (20.5–21.5 dB)", "Rendah (<20.5 dB)"],
    datasets: [
      {
        label: "Jumlah Data",
        data: [cnStats.tinggi, cnStats.cukup, cnStats.rendah],
        backgroundColor: function (context) {
          const index = context.dataIndex;
          return ["#16a34a", "#2563eb", "#dc2626"][index]; // gradien dasar bisa dipakai nanti
        },
        hoverBackgroundColor: function (context) {
          const index = context.dataIndex;
          return ["#22c55e", "#3b82f6", "#ef4444"][index]; // hover lebih terang
        },
        borderRadius: 12,
        barThickness: 100,
        borderSkipped: false,
      },
    ],
  };

  const merChartData = {
    labels: ["Baik (>28 dB)", "cukup (26–28 dB)", "Rendah (<26 dB)"],
    datasets: [
      {
        label: "Jumlah Data",
        data: [merStats.tinggi, merStats.cukup, merStats.rendah],
        backgroundColor: function (context) {
          const index = context.dataIndex;
          return ["#16a34a", "#2563eb", "#dc2626"][index]; // gradien dasar bisa dipakai nanti
        },
        hoverBackgroundColor: function (context) {
          const index = context.dataIndex;
          return ["#22c55e", "#3b82f6", "#ef4444"][index]; // hover lebih terang
        },
        borderRadius: 12,
        barThickness: 100,
        borderSkipped: false,
      },
    ],
  };

  const linkMarginChartData = {
    labels: ["Baik (>6 dB)", "cukup (3–6 dB)", "Rendah (<3 dB)"],
    datasets: [
      {
        label: "Jumlah Data",
        data: [
          linkMarginStats.tinggi,
          linkMarginStats.cukup,
          linkMarginStats.rendah,
        ],
        backgroundColor: function (context) {
          const index = context.dataIndex;
          return ["#16a34a", "#2563eb", "#dc2626"][index]; // gradien dasar bisa dipakai nanti
        },
        hoverBackgroundColor: function (context) {
          const index = context.dataIndex;
          return ["#22c55e", "#3b82f6", "#ef4444"][index]; // hover lebih terang
        },
        borderRadius: 12,
        barThickness: 100,
        borderSkipped: false,
      },
    ],
  };

  const getSignalStatus = (item) => {
    const { power, cn, mer, linkMargin } = item;

    if (power > 48 && cn > 21.5 && mer > 28 && linkMargin > 6) {
      return {
        label: "Sinyal Baik",
        color: "#03543F",
        background: "#DEF7EC",
      };
    } else if (
      power >= 45 &&
      power <= 48 &&
      cn >= 20.5 &&
      cn <= 21.5 &&
      mer >= 26 &&
      mer <= 28 &&
      linkMargin >= 3 &&
      linkMargin <= 6
    ) {
      return {
        label: "Sinyal Cukup",
        color: "#065F46",
        background: "#D1FAE5",
      };
    } else {
      return {
        label: "Sinyal Bermasalah",
        color: "#92400E",
        background: "#FEF3C7",
      };
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      {/* Statistik */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3 className="stat-value">{users.length}</h3>
            <p className="stat-label">Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3 className="stat-value">{data.length}</h3>
            <p className="stat-label">Total Data</p>
          </div>
        </div>
      </div>

      {/* Grafik */}
      <div
        className="charts-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div className="chart-card">
          <h3>Power Ratio Distribution</h3>
          <Bar data={powerChartData} options={barChartOptions} />
        </div>
        <div className="chart-card">
          <h3>C/N Ratio Distribution</h3>
          <Bar data={cnChartData} options={barChartOptions} />
        </div>
        <div className="chart-card">
          <h3>MER Distribution</h3>
          <Bar data={merChartData} options={barChartOptions} />
        </div>
        <div className="chart-card">
          <h3>Link Margin Distribution</h3>
          <Bar data={linkMarginChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Tabel Latest Data + Insight Terkini */}
      <div
        className="dashboard-row"
        style={{ marginTop: "20px", display: "flex", gap: "20px" }}
      >
        {/* Tabel Pengukuran Terbaru */}
        <div className="dashboard-card" style={{ flex: 2 }}>
          <div className="card-header">
            <h3>Latest Measurements</h3>
          </div>
          <div className="measurements-list" style={{ overflowX: "auto" }}>
            <table
              className="modern-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th style={{ padding: "12px" }}>Tanggal/Waktu</th>
                  <th style={{ padding: "12px" }}>Location</th>
                  <th style={{ padding: "12px" }}>User</th>
                  <th style={{ padding: "12px" }}>Power</th>
                  <th style={{ padding: "12px" }}>CN</th>
                  <th style={{ padding: "12px" }}>MER</th>
                  <th style={{ padding: "12px" }}>Link Margin</th>
                  <th style={{ padding: "12px" }}>Audio/Video</th>
                  <th style={{ padding: "12px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {latestData.map((item, index) => {
                  const status = getSignalStatus(item);
                  const bgColor =
                    status.label === "Sinyal Baik"
                      ? "#4CAF50"
                      : status.label === "Sinyal Cukup"
                      ? "#FFC107"
                      : "#F44336";

                  return (
                    <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px" }}>
                        {formatToWIB(item.date)}
                      </td>
                      <td style={{ padding: "12px" }}>{item.kecamatan}</td>
                      <td style={{ padding: "12px" }}>{item.user_name}</td>
                      <td style={{ padding: "12px" }}>
                        {item.power.toFixed(1)}
                      </td>
                      <td style={{ padding: "12px" }}>{item.cn.toFixed(1)}</td>
                      <td style={{ padding: "12px" }}>{item.mer.toFixed(1)}</td>
                      <td style={{ padding: "12px" }}>
                        {item.linkMargin.toFixed(1)}
                      </td>
                      <td style={{ padding: "12px" }}>{item.audioVideo}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            backgroundColor: bgColor,
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            display: "inline-block",
                          }}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insight Terkini */}
        <div
          style={{
            padding: "32px",
            background: "#f9fafb",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "24px",
              color: "#1f2937",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            📡 Insight Terkini
          </h2>

          {insights.length > 0 ? (
            insights.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "linear-gradient(135deg, #fff7ed, #fffef6)",
                  borderLeft: `6px solid ${
                    item.type === "danger" ? "#dc2626" : "#eab308"
                  }`,
                  borderRadius: "14px",
                  padding: "24px",
                  marginBottom: "24px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
                  transition: "transform 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <AlertCircle
                    size={26}
                    style={{
                      color: item.type === "danger" ? "#dc2626" : "#ca8a04",
                      marginRight: "10px",
                    }}
                  />
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    Wilayah:{" "}
                    <span style={{ color: "#1d4ed8" }}>{item.daerah}</span>
                  </h3>
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.7",
                    color: "#374151",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {item.message}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                background: "#ecfdf5",
                borderLeft: "6px solid #10b981",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <AlertCircle size={22} style={{ color: "#047857" }} />
              <p style={{ fontSize: "14px", color: "#065f46" }}>
                Tidak ada insight baru. Semua wilayah dalam kondisi stabil ✅
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function formatToWIB(isoDateString) {
    const utcDate = new Date(isoDateString);
    const wibTime = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
    const day = String(wibTime.getDate()).padStart(2, "0");
    const month = String(wibTime.getMonth() + 1).padStart(2, "0");
    const year = wibTime.getFullYear();
    const hours = String(wibTime.getHours()).padStart(2, "0");
    const minutes = String(wibTime.getMinutes()).padStart(2, "0");
    const seconds = String(wibTime.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}

export default DashboardHome;
