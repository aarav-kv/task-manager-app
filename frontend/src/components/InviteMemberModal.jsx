import React, { useState } from 'react';
import { X, Mail, UserPlus, Copy, Check } from 'lucide-react';
import '../styles/InviteMemberModal.css';

const InviteMemberModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [inviteLink, setInviteLink] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);

    const handleEmailInvite = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/invite/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    email,
                    role
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setEmail('');
                setTimeout(() => {
                    setSuccess(false);
                    onClose();
                }, 2000);
            } else {
                setError(data.message || 'Failed to send invite');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const generateInviteLink = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/invite/link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ role })
            });

            const data = await response.json();

            if (response.ok) {
                setInviteLink(data.inviteLink);
            } else {
                setError(data.message || 'Failed to generate invite link');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>
                        <UserPlus size={20} />
                        Invite Team Member
                    </h2>
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    {success && (
                        <div className="success-message">
                            <Check size={16} />
                            Invitation sent successfully!
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Email Invite Section */}
                    <div className="invite-section">
                        <h3>Send Email Invitation</h3>
                        <form onSubmit={handleEmailInvite}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-with-icon">
                                    <Mail size={16} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Invitation'}
                            </button>
                        </form>
                    </div>

                    {/* Invite Link Section */}
                    <div className="invite-section">
                        <h3>Share Invite Link</h3>
                        <div className="form-group">
                            <label>Role for link recipients</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>

                        {!inviteLink ? (
                            <button
                                onClick={generateInviteLink}
                                className="secondary-btn"
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate Invite Link'}
                            </button>
                        ) : (
                            <div className="link-container">
                                <div className="link-display">
                                    <input
                                        type="text"
                                        value={inviteLink}
                                        readOnly
                                        className="link-input"
                                    />
                                    <button
                                        onClick={copyLink}
                                        className="copy-btn"
                                        title="Copy link"
                                    >
                                        {linkCopied ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="link-info">
                                    This link will expire in 7 days and can be used multiple times.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteMemberModal;