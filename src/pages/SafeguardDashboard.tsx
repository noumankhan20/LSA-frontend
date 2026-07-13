import { useState } from 'react';
import { 
  ClipboardList, 
  MessageSquare, 
  Search, 
  Filter, 
  Send
} from 'lucide-react';

interface SafeguardDashboardProps {
  type: 'raised-tickets' | 'queries';
}

// Initial Mock Tickets (raised by parents and students)
const initialTickets = [
  { 
    id: 'TKT-901', 
    title: 'Severe Exam Anxiety', 
    reporter: 'Parent (Sarah Jenkins)', 
    childName: 'Emily Jenkins (Year 6)',
    role: 'parent',
    category: 'Mental Health & Anxiety',
    severity: 'high', 
    status: 'open', 
    date: '13 July 2026', 
    desc: 'My child Emily gets extremely anxious during maths assessments, leading to panic attacks. She needs support or additional time accommodation.'
  },
  { 
    id: 'TKT-902', 
    title: 'Unexplained drop in engagement', 
    reporter: 'Parent (David Vance)', 
    childName: 'Liam Vance (Year 4)',
    role: 'parent',
    category: 'Engagement & Focus',
    severity: 'medium', 
    status: 'in-progress', 
    date: '12 July 2026', 
    desc: 'Liam has been very quiet and refuses to log in for science reading activities. This started about 3 days ago. Would love advice.'
  },
  { 
    id: 'TKT-903', 
    title: 'Report of Cyberbullying', 
    reporter: 'Student (Noah Patel)', 
    childName: 'Noah Patel (Year 2)',
    role: 'student',
    category: 'Peer Interaction / Bullying',
    severity: 'high', 
    status: 'open', 
    date: '11 July 2026', 
    desc: 'Another student made offensive comments on our study group chat yesterday.'
  },
  { 
    id: 'TKT-904', 
    title: 'Sleep schedule correction support', 
    reporter: 'Parent (Jessica Taylor)', 
    childName: 'Chloe Taylor (Year 3)',
    role: 'parent',
    category: 'Physical Wellbeing',
    severity: 'low', 
    status: 'resolved', 
    date: '08 July 2026', 
    desc: 'Need support with planning a better study routine. Chloe keeps waking up late and missing morning classes.'
  }
];

// Initial Mock Queries (raised by parents and students)
const initialQueries = [
  {
    id: 'QRY-301',
    subject: 'Request for custom SATs revision guides',
    reporter: 'Parent (Sarah Jenkins)',
    role: 'parent',
    date: '13 July 2026',
    status: 'unanswered',
    message: 'Could you please suggest where we can access official SATs revision checklists suited for Year 6 students?',
    replies: []
  },
  {
    id: 'QRY-302',
    subject: 'Cannot find printable science worksheet',
    reporter: 'Student (Emily Jenkins)',
    role: 'student',
    date: '12 July 2026',
    status: 'answered',
    message: 'I cannot find the downloadable PDF for the Plant Life Cycles experiment in Unit 3.',
    replies: [
      { sender: 'Safeguard (You)', date: '12 July 2026', text: 'Hi Emily, I have emailed the PDF to your registered student address and updated the Resource Hub link.' }
    ]
  },
  {
    id: 'QRY-303',
    subject: 'Query regarding student holiday policy',
    reporter: 'Parent (Marcus Broadus)',
    role: 'parent',
    date: '10 July 2026',
    status: 'unanswered',
    message: 'If we take our child out for a family occasion for 2 days next week, will she still get homework catchups?',
    replies: []
  }
];

export default function SafeguardDashboard({ type }: SafeguardDashboardProps) {
  const [tickets, setTickets] = useState(initialTickets);
  const [queries, setQueries] = useState(initialQueries);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<typeof initialTickets[0] | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<typeof initialQueries[0] | null>(null);

  // Quick reply input state
  const [replyText, setReplyText] = useState('');

  // Search/Filter calculations
  const filteredTickets = tickets.filter(tkt => {
    const matchesSearch = tkt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tkt.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tkt.childName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || tkt.severity === filterSeverity;
    const matchesRole = filterRole === 'all' || tkt.role === filterRole;
    return matchesSearch && matchesSeverity && matchesRole;
  });

  const filteredQueries = queries.filter(qry => {
    const matchesSearch = qry.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          qry.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          qry.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || qry.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleTicketStatusChange = (id: string, newStatus: string) => {
    setTickets(prev => prev.map(tkt => tkt.id === id ? { ...tkt, status: newStatus } : tkt));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleAddReply = (e: React.FormEvent, qryId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setQueries(prev => prev.map(qry => {
      if (qry.id === qryId) {
        return {
          ...qry,
          status: 'answered',
          replies: [...qry.replies, { sender: 'Safeguard (You)', date: 'Today', text: replyText }]
        };
      }
      return qry;
    }));

    if (selectedQuery && selectedQuery.id === qryId) {
      setSelectedQuery(prev => prev ? {
        ...prev,
        status: 'answered',
        replies: [...prev.replies, { sender: 'Safeguard (You)', date: 'Today', text: replyText }]
      } : null);
    }

    setReplyText('');
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '10px 0' }}>
      {/* Safeguarding Header Hero */}
      <div className="card-widget" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', color: 'white', padding: '30px', borderRadius: '16px', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {type === 'raised-tickets' ? <ClipboardList size={24} style={{ color: '#60a5fa' }} /> : <MessageSquare size={24} style={{ color: '#60a5fa' }} />}
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
              Safeguard DSL Portal - {type === 'raised-tickets' ? 'Raised Tickets' : 'Queries'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#93c5fd', opacity: 0.95 }}>
              Track active welfare reports, review security alerts, and resolve student or parent concerns promptly.
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Mini Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div className="card-widget" style={{ padding: '16px 20px', backgroundColor: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '500' }}>Active Tickets</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e3a8a', marginTop: '6px' }}>
            {tickets.filter(t => t.status !== 'resolved').length}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '4px', fontWeight: '600' }}>Requires attention</span>
        </div>
        <div className="card-widget" style={{ padding: '16px 20px', backgroundColor: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '500' }}>High Severity Cases</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#b91c1c', marginTop: '6px' }}>
            {tickets.filter(t => t.severity === 'high' && t.status !== 'resolved').length}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '4px', fontWeight: '600' }}>Critical Priority</span>
        </div>
        <div className="card-widget" style={{ padding: '16px 20px', backgroundColor: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '500' }}>Unanswered Queries</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#d97706', marginTop: '6px' }}>
            {queries.filter(q => q.status === 'unanswered').length}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#d97706', marginTop: '4px', fontWeight: '600' }}>Needs response</span>
        </div>
        <div className="card-widget" style={{ padding: '16px 20px', backgroundColor: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '500' }}>Resolved Tickets</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#047857', marginTop: '6px' }}>
            {tickets.filter(t => t.status === 'resolved').length}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#059669', marginTop: '4px', fontWeight: '600' }}>Completed cases</span>
        </div>
      </div>

      {/* Control panel (Search & Filter) */}
      <div className="card-widget" style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search by title, student name, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px', margin: 0, width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Filters:
          </span>

          {type === 'raised-tickets' && (
            <select 
              value={filterSeverity} 
              onChange={(e) => setFilterSeverity(e.target.value)} 
              className="form-input" 
              style={{ fontSize: '0.82rem', padding: '6px 12px', width: '140px', margin: 0 }}
            >
              <option value="all">All Severities</option>
              <option value="high">High Severity</option>
              <option value="medium">Medium Severity</option>
              <option value="low">Low Severity</option>
            </select>
          )}

          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)} 
            className="form-input" 
            style={{ fontSize: '0.82rem', padding: '6px 12px', width: '150px', margin: 0 }}
          >
            <option value="all">All Raised By</option>
            <option value="parent">Raised by Parents</option>
            <option value="student">Raised by Students</option>
          </select>
        </div>
      </div>

      {/* Main List Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedTicket || selectedQuery ? '1.2fr 0.8fr' : '1fr', gap: '24px', alignItems: 'start', transition: 'all 0.3s ease' }}>
        
        {/* Left Hand List Column */}
        <div className="card-widget" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px' }}>
          <h3 className="panel-title-text" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{type === 'raised-tickets' ? 'Tickets Log' : 'Queries Log'}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 'normal', color: '#64748b' }}>
              Showing {type === 'raised-tickets' ? filteredTickets.length : filteredQueries.length} items
            </span>
          </h3>

          {type === 'raised-tickets' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTickets.map(tkt => (
                <div 
                  key={tkt.id} 
                  onClick={() => { setSelectedTicket(tkt); setSelectedQuery(null); }}
                  style={{ 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    cursor: 'pointer',
                    backgroundColor: selectedTicket?.id === tkt.id ? '#f0f4ff' : 'white',
                    borderColor: selectedTicket?.id === tkt.id ? '#3b82f6' : '#e2e8f0',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>{tkt.id}</span>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1e293b', marginTop: '2px' }}>{tkt.title}</h4>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span className={`concern-severity-pill ${tkt.severity}`} style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
                        {tkt.severity}
                      </span>
                      <span style={{ 
                        fontSize: '0.68rem', 
                        padding: '3px 8px', 
                        borderRadius: '12px', 
                        fontWeight: 'bold',
                        backgroundColor: tkt.status === 'resolved' ? '#d1fae5' : tkt.status === 'in-progress' ? '#fef3c7' : '#fee2e2',
                        color: tkt.status === 'resolved' ? '#065f46' : tkt.status === 'in-progress' ? '#92400e' : '#991b1b'
                      }}>
                        {tkt.status}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineBreak: 'anywhere', marginBottom: '12px' }}>
                    {tkt.desc.substring(0, 100)}{tkt.desc.length > 100 ? '...' : ''}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '8px', fontSize: '0.74rem', color: '#64748b' }}>
                    <span>By: <strong>{tkt.reporter}</strong></span>
                    <span>Student: <strong>{tkt.childName}</strong></span>
                    <span>{tkt.date}</span>
                  </div>
                </div>
              ))}
              {filteredTickets.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: '0.85rem' }}>
                  No tickets match the search or filter criteria.
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredQueries.map(qry => (
                <div 
                  key={qry.id} 
                  onClick={() => { setSelectedQuery(qry); setSelectedTicket(null); }}
                  style={{ 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    cursor: 'pointer',
                    backgroundColor: selectedQuery?.id === qry.id ? '#f0f4ff' : 'white',
                    borderColor: selectedQuery?.id === qry.id ? '#3b82f6' : '#e2e8f0',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>{qry.id}</span>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1e293b', marginTop: '2px' }}>{qry.subject}</h4>
                    </div>
                    <span style={{ 
                      fontSize: '0.68rem', 
                      padding: '3px 8px', 
                      borderRadius: '12px', 
                      fontWeight: 'bold',
                      backgroundColor: qry.status === 'answered' ? '#d1fae5' : '#fee2e2',
                      color: qry.status === 'answered' ? '#065f46' : '#991b1b'
                    }}>
                      {qry.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineBreak: 'anywhere', marginBottom: '12px' }}>
                    {qry.message.substring(0, 100)}{qry.message.length > 100 ? '...' : ''}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '8px', fontSize: '0.74rem', color: '#64748b' }}>
                    <span>By: <strong>{qry.reporter}</strong></span>
                    <span>{qry.date}</span>
                  </div>
                </div>
              ))}
              {filteredQueries.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: '0.85rem' }}>
                  No queries match the search or filter criteria.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Detail Pane Column */}
        {(selectedTicket || selectedQuery) && (
          <div className="card-widget" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #3b82f6', position: 'sticky', top: '20px' }}>
            {selectedTicket && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 'bold' }}>{selectedTicket.id}</span>
                  <button 
                    onClick={() => setSelectedTicket(null)} 
                    style={{ background: 'none', border: 'none', fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>{selectedTicket.title}</h3>
                <span className={`concern-severity-pill ${selectedTicket.severity}`} style={{ fontSize: '0.72rem', display: 'inline-block', marginBottom: '16px' }}>
                  {selectedTicket.severity} severity
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: '#475569' }}>
                  <div>Reporter: <strong>{selectedTicket.reporter}</strong></div>
                  <div>Child Profile: <strong>{selectedTicket.childName}</strong></div>
                  <div>Created On: <strong>{selectedTicket.date}</strong></div>
                  <div>Category: <strong>{selectedTicket.category}</strong></div>
                </div>

                <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Ticket Description</h4>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5', marginBottom: '24px', whiteSpace: 'pre-wrap' }}>
                  {selectedTicket.desc}
                </p>

                <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '12px' }}>Update Status</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleTicketStatusChange(selectedTicket.id, 'open')}
                    className="action-btn-outline" 
                    style={{ flex: 1, padding: '8px', fontSize: '0.74rem', borderRadius: '8px', borderColor: '#ef4444', color: '#ef4444', backgroundColor: selectedTicket.status === 'open' ? '#fef2f2' : 'transparent', fontWeight: selectedTicket.status === 'open' ? 'bold' : 'normal' }}
                  >
                    Open
                  </button>
                  <button 
                    onClick={() => handleTicketStatusChange(selectedTicket.id, 'in-progress')}
                    className="action-btn-outline" 
                    style={{ flex: 1, padding: '8px', fontSize: '0.74rem', borderRadius: '8px', borderColor: '#f59e0b', color: '#f59e0b', backgroundColor: selectedTicket.status === 'in-progress' ? '#fffbeb' : 'transparent', fontWeight: selectedTicket.status === 'in-progress' ? 'bold' : 'normal' }}
                  >
                    In Progress
                  </button>
                  <button 
                    onClick={() => handleTicketStatusChange(selectedTicket.id, 'resolved')}
                    className="action-btn-outline" 
                    style={{ flex: 1, padding: '8px', fontSize: '0.74rem', borderRadius: '8px', borderColor: '#10b981', color: '#10b981', backgroundColor: selectedTicket.status === 'resolved' ? '#ecfdf5' : 'transparent', fontWeight: selectedTicket.status === 'resolved' ? 'bold' : 'normal' }}
                  >
                    Resolve
                  </button>
                </div>
              </div>
            )}

            {selectedQuery && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 'bold' }}>{selectedQuery.id}</span>
                  <button 
                    onClick={() => setSelectedQuery(null)} 
                    style={{ background: 'none', border: 'none', fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>{selectedQuery.subject}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>By: <strong>{selectedQuery.reporter}</strong></span>
                  <span style={{ 
                    fontSize: '0.68rem', 
                    padding: '3px 8px', 
                    borderRadius: '12px', 
                    fontWeight: 'bold',
                    backgroundColor: selectedQuery.status === 'answered' ? '#d1fae5' : '#fee2e2',
                    color: selectedQuery.status === 'answered' ? '#065f46' : '#991b1b'
                  }}>
                    {selectedQuery.status}
                  </span>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', color: '#475569', lineHeight: '1.5', marginBottom: '20px' }}>
                  {selectedQuery.message}
                </div>

                {/* Reply Threads */}
                {selectedQuery.replies.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Replies</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {selectedQuery.replies.map((rep, idx) => (
                        <div key={idx} style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
                            <span>{rep.sender}</span>
                            <span style={{ fontWeight: 'normal', color: '#64748b' }}>{rep.date}</span>
                          </div>
                          <p style={{ color: '#475569', margin: 0 }}>{rep.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Reply Form */}
                <form onSubmit={(e) => handleAddReply(e, selectedQuery.id)}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Quick Reply
                  </label>
                  <textarea
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="form-input"
                    rows={4}
                    style={{ fontSize: '0.82rem', padding: '10px', width: '100%', resize: 'none', marginBottom: '12px' }}
                    required
                  />
                  <button 
                    type="submit" 
                    className="login-btn" 
                    style={{ margin: 0, width: '100%', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none' }}
                  >
                    <Send size={14} /> Send Reply
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
