import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'


function DashboardMonitor() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [formData, setFormData] = useState({
    audioVideo: '',
    cn: 0,
    daerah: '',
    kecamatan: '',
    lat: 0,
    linkMargin: 0,
    lon: 0,
    mer: 0,
    power: 0,
    user_name: ''
  })
  const [successMessage, setSuccessMessage] = useState('')

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter data based on search term
  const filteredData = users.filter(item => 
    item.daerah.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kecamatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.audioVideo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  
  function getSignalStatus(power, cn, mer, linkMargin) {
  if (
    power >= 45 && cn >= 20.5 && mer >= 26 && linkMargin >= 3
  ) {
    if (
      power > 48 && cn > 21.5 && mer > 28 && linkMargin > 6
    ) {
      return { label: 'Sinyal Baik', color: '#03543F', background: '#DEF7EC' };
    } else {
      return { label: 'Sinyal Cukup', color: '#065F46', background: '#D1FAE5' };
    }
  } else {
    return { label: 'Sinyal Bermasalah', color: '#92400E', background: '#FEF3C7' };
  }
}

  
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  function generateSummary(power, cn, mer, linkMargin) {
  const summary = [];

  // POWER
  if (power > 48) {
    summary.push("Power baik (>48 dBµV/m).");
  } else if (power >= 45) {
    summary.push("Power cukup (45–48 dBµV/m). Cukup baik.");
  } else {
    summary.push("Power rendah (<45 dBµV/m).\nRekomendasi:\n- Periksa antena atau sistem distribusi sinyal.");
  }

  // C/N RATIO
  if (cn > 21.5) {
    summary.push("C/N Ratio baik (>21.5 dB).");
  } else if (cn >= 20.5) {
    summary.push("C/N Ratio cukup (20.5–21.5 dB). Cukup baik.");
  } else {
    summary.push("C/N Ratio rendah (<20.5 dB).\nSolusi:\n- Hindari interferensi.\n- Perbaiki arah antena.");
  }

  // MER
  if (mer > 28) {
    summary.push("MER baik (>28 dB).");
  } else if (mer >= 26) {
    summary.push("MER cukup (26–28 dB). Cukup baik.");
  } else {
    summary.push("MER rendah (<26 dB).\nSolusi:\n- Periksa koneksi dan perangkat pemancar.");
  }

  // LINK MARGIN
  if (linkMargin > 6) {
    summary.push("Link Margin baik (>6 dB).");
  } else if (linkMargin >= 3) {
    summary.push("Link Margin cukup (3–6 dB). Cukup baik.");
  } else {
    summary.push("Link Margin rendah (<3 dB).\nSolusi:\n- Periksa kekuatan sinyal dan posisi antena.");
  }

  return summary.join("\n\n");
}

function formatToWIB(isoDateString) {
  const utcDate = new Date(isoDateString);

  // Konversi ke WIB (UTC+7)
  const wibTime = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

  // Format manual: DD/MM/YYYY HH:MM:SS
  const day = String(wibTime.getDate()).padStart(2, '0');
  const month = String(wibTime.getMonth() + 1).padStart(2, '0');
  const year = wibTime.getFullYear();
  const hours = String(wibTime.getHours()).padStart(2, '0');
  const minutes = String(wibTime.getMinutes()).padStart(2, '0');
  const seconds = String(wibTime.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/data')
      if (!response.ok) {
        throw new Error('Failed to fetch monitoring data')
      }
      const data = await response.json()
      setUsers(data)
      setError(null)
    } catch (err) {
      setError('Error loading monitoring data: ' + err.message)
      console.error('Error fetching monitoring data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Open view modal
  const handleView = (user) => {
    console.log("View clicked:", user)
    setSelectedUser(user)
    setShowViewModal(true)
  }
  

  // Open edit modal
  const handleEdit = (item) => {
    setSelectedUser(item)
    setFormData({
      audioVideo: item.audioVideo,
      cn: item.cn,
      daerah: item.daerah,
      kecamatan: item.kecamatan,
      lat: item.lat,
      linkMargin: item.linkMargin,
      lon: item.lon,
      mer: item.mer,
      power: item.power,
      user_name: item.user_name
    })
    setShowEditModal(true)
  }

  // Open delete modal
  const handleDelete = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  // Open create modal
  const handleCreate = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      full_name: '',
      role: 'user'
    })
    setShowCreateModal(true)
  }

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`/api/data/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update data')
      }
      
      setSuccessMessage('Data updated successfully!')
      setShowEditModal(false)
      fetchUsers() // Refresh the data list
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    } catch (err) {
      setError('Error updating data: ' + err.message)
      console.error('Error updating data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Delete data
  const handleDeleteConfirm = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/data/${selectedUser.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete data')
      }
      
      setSuccessMessage('Data deleted successfully!')
      setShowDeleteModal(false)
      fetchUsers() // Refresh the data list
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    } catch (err) {
      setError('Error deleting data: ' + err.message)
      console.error('Error deleting data:', err)
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = (groupBy = "daerah") => {
    const groupedData = {}
  
    users.forEach((item) => {
      const key = groupBy === "status"
        ? getSignalStatus(item.power, item.cn, item.mer, item.linkMargin).label
        : item.daerah
  
      if (!groupedData[key]) {
        groupedData[key] = []
      }
  
      groupedData[key].push({
        Nama_User: item.user_name,
        Daerah: item.daerah,
        Kecamatan: item.kecamatan,
        Power: item.power,
        CN: item.cn,
        MER: item.mer,
        LinkMargin: item.linkMargin,
        AudioVideo: item.audioVideo,
        Latitude: item.lat,
        Longitude: item.lon,
        Status: getSignalStatus(item.power, item.cn, item.mer, item.linkMargin).label
      })
    })
  
    const workbook = XLSX.utils.book_new()
  
    Object.entries(groupedData).forEach(([key, data]) => {
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, key.slice(0, 31)) // Nama sheet maksimal 31 karakter
    })
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, `Rekap_Monitoring_${groupBy}.xlsx`)
  }
  

  return (
    <div className="dashboard-users-page">
      <div className="users-header">
        <div>
          <h2>Monitoring Data</h2>
          <p>View and manage system monitoring</p>
        </div>
        <div className="search-container" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search by location or user ..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Reset to first page when searching
            }}
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              width: '300px'
            }}
          />
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Export Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
        <button 
          onClick={() => exportToExcel("daerah")} 
          className="primary-button"
        >
          Export Excel per Wilayah
        </button>
        <button 
          onClick={() => exportToExcel("status")} 
          className="secondary-button"
        >
          Export Excel per Status
        </button>
      </div>

      {/* Users Table */}
      <div className="users-table-container" style={{
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        margin: '1rem 0'
      }}>
        {loading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            <div style={{
              overflowX: 'auto',
              position: 'relative',
              width: '100%'
            }}>
              <table className="users-table" style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                backgroundColor: 'white',
                minWidth: '1200px' // Minimum width to prevent squishing
              }}>
                <thead style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  backgroundColor: '#f3f4f6'
                }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '50px' }}>No</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '160px' }}>Tanggal/Waktu</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '120px' }}>User</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '150px' }}>Nama Daerah</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '150px' }}>Kecamatan</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '80px' }}>Power</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '80px' }}>CN</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '80px' }}>Mer</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '100px' }}>Link Margin</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '120px' }}>Audio/Video</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '100px' }}>Latitude</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '100px' }}>Longitude</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '100px' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap', minWidth: '150px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="13" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No data found</td>
                    </tr>
                  ) : (
                    currentItems.map((item, index) => (
                      <tr key={item.id} style={{ 
                        borderBottom: '1px solid #e5e7eb',
                        backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb'
                      }}>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>{indexOfFirstItem + index + 1}</td>
                        <td style={{ padding: '12px' }}>{formatToWIB(item.date)}</td>
                        <td style={{ padding: '1rem', textAlign: 'left' }}>{item.user_name}</td>
                        <td style={{ padding: '1rem', textAlign: 'left' }}>{item.daerah}</td>
                        <td style={{ padding: '1rem', textAlign: 'left' }}>{item.kecamatan}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>{item.power.toFixed(1)}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>{item.cn.toFixed(1)}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>{item.mer.toFixed(1)}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>{item.linkMargin.toFixed(1)}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '5px',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            backgroundColor: item.audioVideo === 'Tampil' ? '#DEF7EC' : '#FDE8E8',
                            color: item.audioVideo === 'Tampil' ? '#03543F' : '#9B1C1C'
                          }}>
                            {item.audioVideo}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>{item.lat.toFixed(5)}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>{item.lon.toFixed(5)}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
  {(() => {
    const status = getSignalStatus(item.power, item.cn, item.mer, item.linkMargin);
    const bgColor =
      status.label === 'Sinyal Baik' ? '#4CAF50' :
      status.label === 'Sinyal Cukup' ? '#FFC107' :
      '#F44336';

    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: bgColor,
        color: 'white',
        fontSize: '0.875rem',
        display: 'inline-block'
      }}>
        {status.label}
      </span>
    );
  })()}
</td>

                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button 
                              className="action-button view" 
                              onClick={() => handleView(item)}
                              title="View Details"
                              style={{
                                padding: '0.5rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #e5e7eb',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                color: '#3B82F6'
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.25rem', height: '1.25rem' }}>
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                            <button 
                              className="action-button edit" 
                              onClick={() => handleEdit(item)}
                              title="Edit"
                              style={{
                                padding: '0.5rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #e5e7eb',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                color: '#059669'
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.25rem', height: '1.25rem' }}>
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button 
                              className="action-button delete" 
                              onClick={() => handleDelete(item)}
                              title="Delete"
                              style={{
                                padding: '0.5rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #e5e7eb',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                color: '#DC2626'
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.25rem', height: '1.25rem' }}>
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination - moved outside the scrollable container */}
            <div className="pagination" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              padding: '1rem',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: 'white'
            }}>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white'
                }}
              >
                Previous
              </button>
              {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: currentPage === index + 1 ? '#3b82f6' : 'white',
                    color: currentPage === index + 1 ? 'white' : 'black'
                  }}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: currentPage === Math.ceil(filteredData.length / itemsPerPage) ? '#f3f4f6' : 'white'
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Details Data</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="user-details">
                <div className="user-info-grid">
                  <div className="info-group">
                    <label>User</label>
                    <p>{selectedUser.user_name}</p>
                  </div>
                  <div className="info-group">
                    <label>Nama Daerah</label>
                    <p>{selectedUser.daerah}</p>
                  </div>
                  <div className="info-group">
                    <label>Kecamatan</label>
                    <p>{selectedUser.kecamatan}</p>
                  </div>
                  <div className="info-group">
                    <label>Power</label>
                    <p>{selectedUser.power}</p>
                  </div>
                  <div className="info-group">
                    <label>CN</label>
                    <p>{selectedUser.cn}</p>
                  </div>
                  <div className="info-group">
                    <label>Mer</label>
                    <p>{selectedUser.mer}</p>
                  </div>
                  <div className="info-group">
                    <label>Link Margin</label>
                    <p>{selectedUser.linkMargin}</p>
                  </div>
                  <div className="info-group">
                    <label>Audio / Video</label>
                    <p>{selectedUser.audioVideo}</p>
                  </div>
                  <div className="info-group">
                    <label>Coordinates</label>
                    <p>Lat: {selectedUser.lat}, Lon: {selectedUser.lon}</p>
                  </div>
                 <div className="info-group">
                  <label>Status</label>
                  {(() => {
                    const status = getSignalStatus(
                      selectedUser.power,
                      selectedUser.cn,
                      selectedUser.mer,
                      selectedUser.linkMargin
                    )
                    return (
                    
                <p style={{
  backgroundColor:
    status.label === 'Sinyal Baik' ? '#4CAF50' :
    status.label === 'Sinyal Cukup' ? '#FFC107' :
    '#F44336',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.875rem',
  display: 'inline-block'
}}>
  {status.label}
</p>

                    )
                  })()}
                </div>
                </div>
                {/* Summary Section */}
                <div className="info-group" style={{ marginTop: '1rem', width: '100%' }}>
                  <label>Summary</label>
                  <p style={{ whiteSpace: "pre-line" }}>{generateSummary(selectedUser.power, selectedUser.cn, selectedUser.mer, selectedUser.linkMargin)}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Edit Data</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>User Name</label>
                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    readOnly={true}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Nama Daerah</label>
                  <input
                    type="text"
                    name="daerah"
                    value={formData.daerah}
                    onChange={handleInputChange}
                    readOnly={true}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Kecamatan</label>
                  <input
                    type="text"
                    name="kecamatan"
                    value={formData.kecamatan}
                    onChange={handleInputChange}
                    readOnly={true}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Power</label>
                  <input
                    type="number"
                    step="0.1"
                    name="power"
                    value={formData.power}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>CN</label>
                  <input
                    type="number"
                    step="0.1"
                    name="cn"
                    value={formData.cn}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>MER</label>
                  <input
                    type="number"
                    step="0.1"
                    name="mer"
                    value={formData.mer}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Link Margin</label>
                  <input
                    type="number"
                    step="0.1"
                    name="linkMargin"
                    value={formData.linkMargin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Audio/Video</label>
                  <select
                    name="audioVideo"
                    value={formData.audioVideo}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db'
                    }}
                  >
                    <option value="">Select status</option>
                    <option value="Tampil">Tampil</option>
                    <option value="Tidak Tampil">Tidak Tampil</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="0.00001"
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="0.00001"
                    name="lon"
                    value={formData.lon}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="secondary-button" onClick={() => setShowEditModal(false)} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Delete Data</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-confirmation">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="delete-icon" style={{ width: '48px', height: '48px', color: '#EF4444', marginBottom: '1rem' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>Are you sure you want to delete this data from<br /> <strong>{selectedUser.daerah}</strong>?</p>
                <p className="delete-warning" style={{ color: '#EF4444', marginTop: '0.5rem' }}>This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={() => setShowDeleteModal(false)} disabled={loading}>
                Cancel
              </button>
              <button 
                className="danger-button" 
                onClick={handleDeleteConfirm}
                disabled={loading}
                style={{
                  backgroundColor: '#EF4444',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none'
                }}
              >
                {loading ? 'Deleting...' : 'Delete Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardMonitor
