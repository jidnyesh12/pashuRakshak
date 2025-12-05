import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, ExternalLink } from 'lucide-react';
import { ngoAPI } from '../../utils/api';
import type { NGO, VerificationStatus } from '../../types';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const NgoManagement: React.FC = () => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<VerificationStatus | 'all'>('all');
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    setLoading(true);
    try {
      const data = await ngoAPI.getAllNgosAdmin();
      setNgos(data);
    } catch (error) {
      toast.error('Failed to fetch NGOs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (ngo: NGO) => {
    if (!confirm(`Approve ${ngo.name}?`)) return;
    
    try {
      await ngoAPI.approveNgo(ngo.id);
      toast.success(`${ngo.name} approved successfully!`);
      fetchNgos();
    } catch (error) {
      toast.error('Failed to approve NGO');
    }
  };

  const handleReject = (ngo: NGO) => {
    setSelectedNgo(ngo);
    setShowRejectModal(true);
  };

  const submitRejection = async () => {
    if (!selectedNgo || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await ngoAPI.rejectNgo(selectedNgo.id, rejectionReason);
      toast.success(`${selectedNgo.name} rejected`);
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedNgo(null);
      fetchNgos();
    } catch(error) {
      toast.error('Failed to reject NGO');
    }
  };

  const filteredNgos = ngos.filter(ngo => {
    if (selectedTab === 'all') return true;
    return ngo.verificationStatus === selectedTab;
  });

  const stats = {
    all: ngos.length,
    PENDING: ngos.filter(n => n.verificationStatus === 'PENDING').length,
    APPROVED: ngos.filter(n => n.verificationStatus === 'APPROVED').length,
    REJECTED: ngos.filter(n => n.verificationStatus === 'REJECTED').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="All NGOs"
          value={stats.all}
          icon={<FileText className="w-6 h-6" />}
          color="gray"
          active={selectedTab === 'all'}
          onClick={() => setSelectedTab('all')}
        />
       <StatCard
          label="Pending"
          value={stats.PENDING}
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
          active={selectedTab === 'PENDING'}
          onClick={() => setSelectedTab('PENDING')}
        />
        <StatCard
          label="Approved"
          value={stats.APPROVED}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
          active={selectedTab === 'APPROVED'}
          onClick={() => setSelectedTab('APPROVED')}
        />
        <StatCard
          label="Rejected"
          value={stats.REJECTED}
          icon={<XCircle className="w-6 h-6" />}
          color="red"
          active={selectedTab === 'REJECTED'}
          onClick={() => setSelectedTab('REJECTED')}
        />
      </div>

      {/* NGO List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedTab === 'all' ? 'All NGOs' : `${selectedTab} NGOs`}
          </h3>

          {filteredNgos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No NGOs found</p>
          ) : (
            <div className="space-y-4">
              {filteredNgos.map((ngo) => (
                <NgoCard
                  key={ngo.id}
                  ngo={ngo}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && selectedNgo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject {selectedNgo.name}
            </h3>
            <textarea
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
              rows={4}
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedNgo(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'gray' | 'yellow' | 'green' | 'red';
  active: boolean;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, active, onClick }) => {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        active ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
};

interface NgoCardProps {
  ngo: NGO;
  onApprove: (ngo: NGO) => void;
  onReject: (ngo: NGO) => void;
}

const NgoCard: React.FC<NgoCardProps> = ({ ngo, onApprove, onReject }) => {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-gray-900">{ngo.name}</h4>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[ngo.verificationStatus]}`}>
              {ngo.verificationStatus}
            </span>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>📧 {ngo.email}</p>
            <p>📞 {ngo.phone}</p>
            <p>📍 {ngo.address}</p>
            {ngo.description && <p className="mt-2 text-gray-500">{ngo.description}</p>}
            {ngo.registrationDocumentUrl && (
              <a
                href={ngo.registrationDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 mt-2"
              >
                <FileText className="w-4 h-4" />
                View Registration Document
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {ngo.rejectionReason && (
              <p className="mt-2 text-red-600 text-xs">
                <strong>Rejection Reason:</strong> {ngo.rejectionReason}
              </p>
            )}
          </div>
        </div>

        {ngo.verificationStatus === 'PENDING' && (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(ngo)}
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => onReject(ngo)}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NgoManagement;
