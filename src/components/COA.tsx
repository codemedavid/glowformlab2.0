import React, { useState, useEffect } from 'react';
import { Shield, Award, CheckCircle, X, ExternalLink, Download, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface COAReport {
  id: string;
  product_name: string;
  batch: string;
  test_date: string;
  purity_percentage: number;
  quantity: string;
  task_number: string;
  verification_key: string;
  image_url: string;
  featured: boolean;
  laboratory: string;
}

const COA: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [coaReports, setCOAReports] = useState<COAReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCOAReports();
  }, []);

  const fetchCOAReports = async () => {
    try {
      const { data, error } = await supabase
        .from('coa_reports')
        .select('*')
        .order('test_date', { ascending: false });

      if (error) throw error;
      setCOAReports(data || []);
    } catch (error) {
      console.error('Error fetching COA reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-100 to-blue-100 py-12 md:py-16">
        <div className="absolute top-0 left-0 w-64 h-64 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-cute mb-6 border-2 border-sky-200">
              <Shield className="w-5 h-5 text-sky-500" />
              <span className="text-sm font-bold text-sky-600">Third-Party Lab Verified</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800">
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                Certificates of Analysis
              </span>
              <Sparkles className="inline-block w-8 h-8 md:w-10 md:h-10 text-yellow-400 ml-3 mb-2 animate-pulse" />
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              All our products are tested by <strong className="text-sky-600">Janoshik Analytical</strong> - 
              a leading independent laboratory specializing in peptide analysis
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-sky-200">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-gray-700">99%+ Purity</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-sky-200">
                <Award className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-700">Lab Certified</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-sky-200">
                <Shield className="w-5 h-5 text-sky-500" />
                <span className="font-medium text-gray-700">Verified Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COA Reports Grid */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {coaReports.length === 0 ? (
            <div className="col-span-2 text-center py-20">
              <Shield className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No lab reports available yet.</p>
            </div>
          ) : (
            coaReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl shadow-cute hover:shadow-glow transition-all duration-300 overflow-hidden border-2 border-sky-100 hover:border-sky-200 transform hover:-translate-y-2"
              >
                {/* Report Image */}
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => setSelectedImage(report.image_url)}
                >
                <img
                  src={report.image_url}
                  alt={`${report.product_name} Certificate of Analysis`}
                  className="w-full h-64 md:h-80 object-cover object-top"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f9ff" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%230ea5e9" font-size="20" font-family="Arial"%3ECOA Image Coming Soon%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute inset-0 bg-sky-600/0 group-hover:bg-sky-600/10 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
                    <p className="text-sm font-bold text-sky-600 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Click to view full report
                    </p>
                  </div>
                </div>
              </div>

                {/* Report Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{report.product_name}</h3>
                  {report.featured && (
                    <span className="bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold border border-sky-300">
                      ✓ VERIFIED
                    </span>
                  )}
                </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between py-2 border-b border-sky-100">
                      <span className="text-sm text-gray-600 font-medium">Purity:</span>
                      <span className="text-base font-bold text-green-600">{report.purity_percentage}%</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-sky-100">
                      <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                      <span className="text-base font-bold text-sky-600">{report.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-sky-100">
                      <span className="text-sm text-gray-600 font-medium">Test Date:</span>
                      <span className="text-sm text-gray-800">{new Date(report.test_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-sky-100">
                      <span className="text-sm text-gray-600 font-medium">Task Number:</span>
                      <span className="text-sm text-gray-800 font-mono">{report.task_number}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <a
                      href={`https://www.janoshik.com/verify/?key=${report.verification_key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white px-4 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Shield className="w-5 h-5" />
                      Verify on Janoshik
                    </a>
                    
                    <button
                      onClick={() => setSelectedImage(report.image_url)}
                      className="w-full flex items-center justify-center gap-2 bg-white text-sky-600 border-2 border-sky-400 hover:border-sky-500 hover:bg-sky-50 px-4 py-3 rounded-2xl font-medium transition-all duration-300"
                    >
                      <Download className="w-5 h-5" />
                      View Full Report
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl p-6 md:p-8 border-2 border-sky-200 shadow-cute">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-3">About Janoshik Analytical</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Janoshik Analytical is a leading independent laboratory specializing in the analysis of 
                  peptides, SARMs, and other research compounds. Their state-of-the-art HPLC and mass 
                  spectrometry equipment provides accurate, reliable results you can trust.
                </p>
                <a
                  href="https://www.janoshik.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
                >
                  <span>Visit Janoshik Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition-all shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Certificate of Analysis"
              className="w-full h-auto rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default COA;

