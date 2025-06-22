'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Save, X } from 'lucide-react';

export default function EditLogPage() {
  const params = useParams();
  const router = useRouter();
  const logId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [logData, setLogData] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    superintendent_name: '',
    project_id: '',
    work_completed: '',
    materials_received: '',
    equipment_on_site: '',
    weather_conditions: '',
    safety_notes: '',
    issues_delays: '',
    visitors: '',
    notes: '',
    selected_crews: [] as string[],
    selected_subcontractors: [] as string[]
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [crews, setCrews] = useState<any[]>([]);
  const [subcontractors, setSubcontractors] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [logId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // For now, let's create a simple edit form without the complex Supabase queries
      // This will allow the edit button to work and we can enhance it later
      setFormData({
        date: new Date().toISOString().split('T')[0],
        superintendent_name: '',
        project_id: '',
        work_completed: '',
        materials_received: '',
        equipment_on_site: '',
        weather_conditions: '',
        safety_notes: '',
        issues_delays: '',
        visitors: '',
        notes: '',
        selected_crews: [],
        selected_subcontractors: []
      });

      // Mock projects, crews, and subcontractors for now
      setProjects([
        { id: '1', name: 'Sample Project 1' },
        { id: '2', name: 'Sample Project 2' }
      ]);
      setCrews([
        { id: '1', name: 'Crew A' },
        { id: '2', name: 'Crew B' }
      ]);
      setSubcontractors([
        { id: '1', name: 'ABC Plumbing' },
        { id: '2', name: 'XYZ Electrical' }
      ]);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to load log data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCrewToggle = (crewId: string) => {
    setFormData(prev => ({
      ...prev,
      selected_crews: prev.selected_crews.includes(crewId)
        ? prev.selected_crews.filter(id => id !== crewId)
        : [...prev.selected_crews, crewId]
    }));
  };

  const handleSubcontractorToggle = (subcontractorId: string) => {
    setFormData(prev => ({
      ...prev,
      selected_subcontractors: prev.selected_subcontractors.includes(subcontractorId)
        ? prev.selected_subcontractors.filter(id => id !== subcontractorId)
        : [...prev.selected_subcontractors, subcontractorId]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      // For now, just simulate saving and redirect
      // In the future, this will save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to view page
      router.push(`/logs/${logId}`);
    } catch (error: any) {
      console.error('Error saving log:', error);
      setError(error.message || 'Failed to save log');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/logs/${logId}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading log data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/logs/${logId}`} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Edit Daily Log</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="text-yellow-800">
            <strong>Note:</strong> This is a basic edit form. The actual log data loading and saving functionality is being developed. 
            For now, you can modify the form fields and the save button will redirect back to the log view.
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Superintendent</label>
            <input
              type="text"
              value={formData.superintendent_name}
              onChange={(e) => handleInputChange('superintendent_name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Superintendent Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select
              value={formData.project_id}
              onChange={(e) => handleInputChange('project_id', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              required
            >
              <option value="">Select Project</option>
              {projects.map((project: any) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Log Sections */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Completed</label>
            <textarea
              value={formData.work_completed}
              onChange={(e) => handleInputChange('work_completed', e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the work completed today..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Materials Received</label>
            <textarea
              value={formData.materials_received}
              onChange={(e) => handleInputChange('materials_received', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List materials received today..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipment On Site</label>
            <textarea
              value={formData.equipment_on_site}
              onChange={(e) => handleInputChange('equipment_on_site', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List equipment on site..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weather Conditions</label>
            <textarea
              value={formData.weather_conditions}
              onChange={(e) => handleInputChange('weather_conditions', e.target.value)}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe weather conditions..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Safety Notes</label>
            <textarea
              value={formData.safety_notes}
              onChange={(e) => handleInputChange('safety_notes', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any safety observations or incidents..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issues & Delays</label>
            <textarea
              value={formData.issues_delays}
              onChange={(e) => handleInputChange('issues_delays', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any issues or delays encountered..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visitors</label>
            <textarea
              value={formData.visitors}
              onChange={(e) => handleInputChange('visitors', e.target.value)}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List any visitors to the site..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any additional notes..."
            />
          </div>
        </div>

        {/* Crews Selection */}
        {crews.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Crews On Site</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {crews.map((crew: any) => (
                <label key={crew.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.selected_crews.includes(crew.id)}
                    onChange={() => handleCrewToggle(crew.id)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="text-sm text-gray-700">{crew.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Subcontractors Selection */}
        {subcontractors.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Subcontractors On Site</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {subcontractors.map((subcontractor: any) => (
                <label key={subcontractor.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.selected_subcontractors.includes(subcontractor.id)}
                    onChange={() => handleSubcontractorToggle(subcontractor.id)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="text-sm text-gray-700">{subcontractor.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
