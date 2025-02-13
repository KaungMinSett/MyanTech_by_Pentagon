
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Building2, User, Calendar, DollarSign, Truck, MapPin, FileText } from 'lucide-react';
import { financeData } from '../../mocks/finance/finance-data';

function FinanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const finance = financeData.find(item => item.id === Number(id));
  
  if (!finance) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Finance record not found</h2>
          <button
            onClick={() => navigate('/finance')}
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={() => navigate('/finance')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>

        <div className=" overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{finance.deliveryGroup}</h1>
                <p className="mt-1 text-sm text-gray-500">Transaction ID: #{finance.id.toString().padStart(6, '0')}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
                  finance.status === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {finance.status === 'verified' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                {finance.status.charAt(0).toUpperCase() + finance.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Total Amount</p>
                        <p className="text-2xl font-bold text-green-600">${finance.totalCash.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Transaction Date</p>
                        <p className="text-sm text-gray-600">{finance.verifiedDate || 'Pending Verification'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Delivery Group</p>
                        <p className="text-sm text-gray-600">{finance.deliveryGroup}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Region</p>
                        <p className="text-sm text-gray-600">{finance.region}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Personnel Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Issued By</p>
                        <p className="text-sm text-gray-600">{finance.issuedBy}</p>
                        <p className="text-xs text-gray-500">{finance.issuerRole}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Department</p>
                        <p className="text-sm text-gray-600">{finance.department}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Notes</p>
                        <p className="text-sm text-gray-600">{finance.notes || 'No additional notes'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinanceDetail;