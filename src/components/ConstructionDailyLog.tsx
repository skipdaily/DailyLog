'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Save, Users, Building2, Calendar, FileText, AlertTriangle, MessageSquare, Wrench, CheckSquare, Eye, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// Simple function to generate IDs without requiring uuid
const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Define types for our data model
interface DailyLogData {
  id: string;
  date: string;
  superintendentName: string;
  projectId: string | null;
  projectName: string;
  subcontractors: Subcontractor[];
  crews: Crew[];
  workItems: TextItem[];
  delays: TextItem[];
  tradesOnsite: TextItem[];
  meetings: TextItem[];
  outOfScope: TextItem[];
  actionItems: TextItem[];
  nextDayPlan: TextItem[];
  notes: TextItem[];
}

interface Project {
  id: string;
  name: string;
  location?: string;
  client?: string;
}

interface Subcontractor {
  id: string;
  name: string;
}

interface Crew {
  id: string;
  name: string;
  members: CrewMember[];
}

interface CrewMember {
  id: string;
  name: string;
}

interface TextItem {
  id: string;
  text: string;
}

interface SectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  showActionButton?: boolean;
  onCreateActionItem?: (sectionType: string, content: string) => void;
  sectionType?: string;
}

// Section component for consistent UI sections
const Section: React.FC<SectionProps> = ({ title, icon: Icon, children, showActionButton, onCreateActionItem, sectionType }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {showActionButton && onCreateActionItem && sectionType && (
        <button
          onClick={() => {
            const content = prompt(`Create action item from ${title}:\n\nEnter the action item description:`);
            if (content && content.trim()) {
              onCreateActionItem(sectionType, content.trim());
            }
          }}
          className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
          title="Create Action Item"
        >
          <Plus className="w-4 h-4" />
          Action Item
        </button>
      )}
    </div>
    {children}
  </div>
);

// Text items list component
const TextItemsList = ({ 
  items, 
  setItems, 
  placeholder,
  rows = 3
}: { 
  items: TextItem[], 
  setItems: (items: TextItem[]) => void,
  placeholder: string,
  rows?: number
}) => {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [{ id: generateId(), text: '' }];
  
  const addItem = () => {
    setItems([...safeItems, { id: generateId(), text: '' }]);
  };

  const updateItem = (id: string, text: string) => {
    setItems(safeItems.map(item => 
      item.id === id ? { ...item, text } : item
    ));
  };

  const removeItem = (id: string) => {
    if (safeItems.length <= 1) return;
    setItems(safeItems.filter(item => item.id !== id));
  };

  return (
    <div>
      {safeItems.map(item => (
        <div key={item.id} className="flex gap-2 mb-3">
          <textarea
            value={item.text}
            onChange={(e) => updateItem(item.id, e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <button
            onClick={() => removeItem(item.id)}
            className="text-red-600 hover:text-red-800 p-2"
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        type="button"
      >
        <Plus className="h-4 w-4" />
        Add Item
      </button>
    </div>
  );
};

// Subcontractors management component
const SubcontractorManager = ({ 
  subcontractors, 
  setSubcontractors,
  availableSubcontractors 
}: { 
  subcontractors: Subcontractor[], 
  setSubcontractors: (subs: Subcontractor[]) => void,
  availableSubcontractors: Subcontractor[]
}) => {
  const [selectedSubcontractorId, setSelectedSubcontractorId] = useState('');

  const addSubcontractor = () => {
    if (!selectedSubcontractorId) return;
    
    const subcontractor = availableSubcontractors.find(s => s.id === selectedSubcontractorId);
    if (!subcontractor) return;
    
    // Check if already added
    if (subcontractors.find(s => s.id === subcontractor.id)) return;
    
    setSubcontractors([...subcontractors, subcontractor]);
    setSelectedSubcontractorId('');
  };

  const removeSubcontractor = (id: string) => {
    setSubcontractors(subcontractors.filter(sub => sub.id !== id));
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <select
          value={selectedSubcontractorId}
          onChange={(e) => setSelectedSubcontractorId(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a subcontractor</option>
          {availableSubcontractors
            .filter(sub => !subcontractors.find(s => s.id === sub.id))
            .map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))
          }
        </select>
        <button
          onClick={addSubcontractor}
          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          type="button"
          disabled={!selectedSubcontractorId}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2">
        {subcontractors.map(sub => (
          <div key={sub.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <span>{sub.name}</span>
            <button
              onClick={() => removeSubcontractor(sub.id)}
              className="text-red-600 hover:text-red-800"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {subcontractors.length === 0 && (
          <p className="text-gray-500 italic">No subcontractors selected</p>
        )}
      </div>
    </div>
  );
};

// Crews management component
const CrewManager = ({ 
  crews, 
  setCrews,
  availableCrews 
}: { 
  crews: Crew[], 
  setCrews: (crews: Crew[]) => void,
  availableCrews: Crew[]
}) => {
  const [selectedCrewId, setSelectedCrewId] = useState('');
  
  const addCrew = () => {
    if (!selectedCrewId) return;
    
    const crew = availableCrews.find(c => c.id === selectedCrewId);
    if (!crew) return;
    
    // Check if already added
    if (crews.find(c => c.id === crew.id)) return;
    
    setCrews([...crews, crew]);
    setSelectedCrewId('');
  };

  const removeCrew = (crewId: string) => {
    setCrews(crews.filter(crew => crew.id !== crewId));
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <select
          value={selectedCrewId}
          onChange={(e) => setSelectedCrewId(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a crew</option>
          {availableCrews
            .filter(crew => !crews.find(c => c.id === crew.id))
            .map(crew => (
              <option key={crew.id} value={crew.id}>{crew.name}</option>
            ))
          }
        </select>
        <button
          onClick={addCrew}
          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          type="button"
          disabled={!selectedCrewId}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-4">
        {crews.map(crew => (
          <div key={crew.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">{crew.name}</h4>
              <button
                onClick={() => removeCrew(crew.id)}
                className="text-red-600 hover:text-red-800"
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {crew.members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-2 bg-white rounded-md border">
                  <span className="text-sm">{member.name}</span>
                </div>
              ))}
              {crew.members.length === 0 && (
                <p className="text-gray-500 text-sm italic">No team members in this crew</p>
              )}
            </div>
          </div>
        ))}
        {crews.length === 0 && (
          <p className="text-gray-500 italic">No crews selected</p>
        )}
      </div>
    </div>
  );
};

// Trades list component
const TradesList = ({ 
  trades, 
  setTrades 
}: { 
  trades: TextItem[], 
  setTrades: (trades: TextItem[]) => void
}) => {
  // Ensure trades is always an array
  const safeTrades = Array.isArray(trades) ? trades : [{ id: generateId(), text: '' }];
  
  const addTrade = () => {
    setTrades([...safeTrades, { id: generateId(), text: '' }]);
  };

  const updateTrade = (id: string, text: string) => {
    setTrades(safeTrades.map(trade => 
      trade.id === id ? { ...trade, text } : trade
    ));
  };

  const removeTrade = (id: string) => {
    if (safeTrades.length <= 1) return;
    setTrades(safeTrades.filter(trade => trade.id !== id));
  };

  return (
    <div>
      {safeTrades.map(trade => (
        <div key={trade.id} className="flex gap-2 mb-3">
          <input
            type="text"
            value={trade.text}
            onChange={(e) => updateTrade(trade.id, e.target.value)}
            placeholder="Enter trade name (e.g., JLS, HTI - windows and sliders, OJV - Sheet Metal)"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => removeTrade(trade.id)}
            className="text-red-600 hover:text-red-800 p-2"
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addTrade}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        type="button"
      >
        <Plus className="h-4 w-4" />
        Add Trade
      </button>
    </div>
  );
};

// Print view component
const PrintView = React.forwardRef<HTMLDivElement, { logData: DailyLogData }>(
  ({ logData }, ref) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: '2-digit', 
        month: 'numeric', 
        day: 'numeric' 
      });
    };

    return (
      <div ref={ref} className="hidden print:block">
        <div className="max-w-4xl mx-auto p-8 bg-white">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-4">DAILY LOG</h1>
            <div className="text-left">
              <p>
                <strong>Daily Log Date:</strong> {formatDate(logData.date)} 
                <strong> Prepared By:</strong> {logData.superintendentName} 
                <strong> Project / Worksite:</strong> {logData.projectName}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">1. Work Performed (All Trades)</h3>
              <ul className="list-disc list-inside space-y-1">
                {logData.workItems.filter(item => item.text.trim()).map(item => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">2. Delays / Disruptions</h3>
              <ul className="list-disc list-inside space-y-1">
                {logData.delays.filter(item => item.text.trim()).map(item => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">3. Trades Onsite</h3>
              <ul className="list-disc list-inside space-y-1">
                {logData.tradesOnsite.filter(item => item.text.trim()).map(item => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">4. Meetings / Discussions</h3>
              <div className="space-y-2">
                {logData.meetings.filter(item => item.text.trim()).map(item => (
                  <div key={item.id} className="whitespace-pre-wrap">{item.text}</div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">5. Out-of-Scope / Extra Work Identified</h3>
              <ul className="list-disc list-inside space-y-1">
                {logData.outOfScope.filter(item => item.text.trim()).map(item => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">6. Action Items</h3>
              <ul className="list-disc list-inside space-y-1">
                {logData.actionItems.filter(item => item.text.trim()).map(item => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">7. Plan for Next Day (All Trades)</h3>
              <ul className="list-disc list-inside space-y-1">
                {logData.nextDayPlan.filter(item => item.text.trim()).map(item => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">8. Notes / Observations</h3>
              <div className="space-y-2">
                {logData.notes.filter(item => item.text.trim()).map(item => (
                  <div key={item.id} className="whitespace-pre-wrap">{item.text}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintView.displayName = 'PrintView';

// Main ConstructionDailyLog component
const ConstructionDailyLog = () => {
  // Ensure all items have default arrays with at least one item
  const createDefaultItem = () => ({ id: generateId(), text: '' });
  const createDefaultArray = () => [createDefaultItem()];
  
  const createDefaultCrewMember = (name: string) => ({ id: generateId(), name });
  const createDefaultCrew = (name: string, members: string[] = []) => ({
    id: generateId(),
    name,
    members: members.map(name => createDefaultCrewMember(name))
  });
  
  // Initialize state with unique IDs for all items
  const [logData, setLogData] = useState<DailyLogData>({
    id: generateId(),
    date: new Date().toISOString().split('T')[0],
    superintendentName: '',
    projectId: null,
    projectName: '',
    subcontractors: [],
    crews: [],
    workItems: createDefaultArray(),
    delays: createDefaultArray(),
    tradesOnsite: createDefaultArray(),
    meetings: createDefaultArray(),
    outOfScope: createDefaultArray(),
    actionItems: createDefaultArray(),
    nextDayPlan: createDefaultArray(),
    notes: createDefaultArray(),
  });

  // Additional state for Supabase integration
  const [projects, setProjects] = useState<Project[]>([]);
  const [availableSubcontractors, setAvailableSubcontractors] = useState<Subcontractor[]>([]);
  const [availableCrews, setAvailableCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const printRef = React.useRef<HTMLDivElement>(null);

  // Fetch data from Supabase on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, location, client')
        .order('name');
      
      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Fetch subcontractors
      const { data: subcontractorsData, error: subcontractorsError } = await supabase
        .from('subcontractors')
        .select('id, name')
        .order('name');
      
      if (subcontractorsError) throw subcontractorsError;
      setAvailableSubcontractors(subcontractorsData || []);

      // Fetch crews with members
      const { data: crewsData, error: crewsError } = await supabase
        .from('crews')
        .select(`
          id,
          name,
          crew_members(id, name, role)
        `)
        .order('name');
      
      if (crewsError) throw crewsError;
      
      // Transform crew data to match our interface
      const transformedCrews = (crewsData || []).map(crew => ({
        id: crew.id,
        name: crew.name,
        members: (crew.crew_members || []).map((member: any) => ({
          id: member.id,
          name: member.name
        }))
      }));
      
      setAvailableCrews(transformedCrews);
      
    } catch (error: any) {
      console.error('Error fetching initial data:', error);
      setError(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogData(prev => ({ ...prev, date: e.target.value }));
  };

  const handleSuperintendentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogData(prev => ({ ...prev, superintendentName: e.target.value }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProject = projects.find(p => p.id === e.target.value);
    setLogData(prev => ({ 
      ...prev, 
      projectId: e.target.value || null,
      projectName: selectedProject?.name || ''
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Validation
      if (!logData.date || !logData.superintendentName || !logData.projectId) {
        throw new Error('Please fill in all required fields (Date, Superintendent, Project)');
      }

      // Save daily log
      const { data: dailyLogData, error: dailyLogError } = await supabase
        .from('daily_logs')
        .insert([{
          date: logData.date,
          project_id: logData.projectId,
          superintendent_name: logData.superintendentName
        }])
        .select()
        .single();

      if (dailyLogError) throw dailyLogError;

      const logId = dailyLogData.id;

      // Prepare log sections
      const logSections = [];
      let orderNum = 1;

      // Add all sections with content
      const sectionMap = [
        { type: 'work_performed', items: logData.workItems },
        { type: 'delays', items: logData.delays },
        { type: 'trades_onsite', items: logData.tradesOnsite },
        { type: 'meetings', items: logData.meetings },
        { type: 'out_of_scope', items: logData.outOfScope },
        { type: 'action_items', items: logData.actionItems },
        { type: 'next_day_plan', items: logData.nextDayPlan },
        { type: 'notes', items: logData.notes }
      ];

      for (const section of sectionMap) {
        for (const item of section.items) {
          if (item.text.trim()) {
            logSections.push({
              log_id: logId,
              section_type: section.type,
              content: item.text.trim(),
              order_num: orderNum++
            });
          }
        }
      }

      // Save log sections
      if (logSections.length > 0) {
        const { error: sectionsError } = await supabase
          .from('log_sections')
          .insert(logSections);

        if (sectionsError) throw sectionsError;
      }

      // Save subcontractor associations
      const subcontractorAssociations = logData.subcontractors.map(sub => ({
        log_id: logId,
        subcontractor_id: sub.id
      }));

      if (subcontractorAssociations.length > 0) {
        const { error: subcontractorsError } = await supabase
          .from('log_subcontractors')
          .insert(subcontractorAssociations);

        if (subcontractorsError) throw subcontractorsError;
      }

      // Save crew associations
      const crewAssociations = logData.crews.map(crew => ({
        log_id: logId,
        crew_id: crew.id
      }));

      if (crewAssociations.length > 0) {
        const { error: crewsError } = await supabase
          .from('log_crews')
          .insert(crewAssociations);

        if (crewsError) throw crewsError;
      }

      setSuccess('Daily log saved successfully!');
      
      // Optionally redirect or reset form
      // window.location.href = '/dashboard';
      
    } catch (error: any) {
      console.error('Error saving daily log:', error);
      setError(error.message || 'Failed to save daily log');
    } finally {
      setSaving(false);
    }
  };

  const handleExportToPDF = () => {
    if (!printRef.current) return;
    
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printRef.current.innerHTML;
    document.title = `Daily Log - ${logData.projectName} - ${logData.date}`;
    
    window.print();
    
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const createActionItem = async (sectionType: string, content: string) => {
    try {
      // Map section types to source types
      const sourceTypeMap: { [key: string]: string } = {
        'meetings': 'meeting',
        'outOfScope': 'out_of_scope', 
        'actionItems': 'action_item',
        'notes': 'observation'
      };

      const sourceType = sourceTypeMap[sectionType] || 'action_item';

      // Create action item data
      const actionItemData = {
        title: content.length > 50 ? content.substring(0, 50) + '...' : content,
        description: content,
        source_type: sourceType,
        source_content: content,
        project_id: logData.projectId,
        priority: 'medium',
        status: 'open',
        created_by: logData.superintendentName || 'Unknown'
      };

      // Insert into action_items table
      const { error } = await supabase
        .from('action_items')
        .insert([actionItemData]);

      if (error) throw error;

      setSuccess('Action item created successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error: any) {
      console.error('Error creating action item:', error);
      setError(error.message || 'Failed to create action item');
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Construction Daily Log</h1>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                type="button"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleExportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                type="button"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}

          {loading && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">
              Loading project data...
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                value={logData.date}
                onChange={handleDateChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Superintendent Name *</label>
              <input
                type="text"
                value={logData.superintendentName}
                onChange={handleSuperintendentChange}
                placeholder="Enter your name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
              <select
                value={logData.projectId || ''}
                onChange={handleProjectChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name} {project.location && `- ${project.location}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Manage Subcontractors and Crews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Section title="Manage Subcontractors" icon={Users}>
            <SubcontractorManager 
              subcontractors={logData.subcontractors} 
              setSubcontractors={(newSubs: Subcontractor[]) => setLogData(prev => ({ ...prev, subcontractors: newSubs }))}
              availableSubcontractors={availableSubcontractors}
            />
          </Section>

          <Section title="Manage Crews" icon={Users}>
            <CrewManager 
              crews={logData.crews} 
              setCrews={(newCrews: Crew[]) => setLogData(prev => ({ ...prev, crews: newCrews }))}
              availableCrews={availableCrews}
            />
          </Section>
        </div>

        {/* Work Performed */}
        <Section title="1. Work Performed (All Trades)" icon={Wrench}>
          <TextItemsList 
            items={logData.workItems || createDefaultArray()} 
            setItems={(newItems: TextItem[]) => setLogData(prev => ({ ...prev, workItems: newItems }))} 
            placeholder="Describe work performed..."
          />
        </Section>

        {/* Delays */}
        <Section title="2. Delays / Disruptions" icon={AlertTriangle}>
          <TextItemsList 
            items={logData.delays || createDefaultArray()} 
            setItems={(newItems: TextItem[]) => setLogData(prev => ({ ...prev, delays: newItems }))} 
            placeholder="Describe delays or disruptions..."
          />
        </Section>

        {/* Trades Onsite */}
        <Section title="3. Trades Onsite" icon={Users}>
          <TradesList 
            trades={logData.tradesOnsite || createDefaultArray()} 
            setTrades={(newTrades: TextItem[]) => setLogData(prev => ({ ...prev, tradesOnsite: newTrades }))} 
          />
        </Section>

        {/* Meetings */}
        <Section 
          title="4. Meetings / Discussions" 
          icon={MessageSquare}
          showActionButton={true}
          onCreateActionItem={createActionItem}
          sectionType="meetings"
        >
          <TextItemsList 
            items={logData.meetings || createDefaultArray()} 
            setItems={(newItems: TextItem[]) => setLogData(prev => ({ ...prev, meetings: newItems }))} 
            placeholder="Describe meetings and discussions..."
            rows={4}
          />
        </Section>

        {/* Out of Scope */}
        <Section 
          title="5. Out-of-Scope / Extra Work Identified" 
          icon={FileText}
          showActionButton={true}
          onCreateActionItem={createActionItem}
          sectionType="outOfScope"
        >
          <TextItemsList 
            items={logData.outOfScope || createDefaultArray()} 
            setItems={(newItems: TextItem[]) => setLogData(prev => ({ ...prev, outOfScope: newItems }))} 
            placeholder="Describe out-of-scope or extra work..."
          />
        </Section>

        {/* Action Items */}
        <Section 
          title="6. Action Items" 
          icon={CheckSquare}
          showActionButton={true}
          onCreateActionItem={createActionItem}
          sectionType="actionItems"
        >
          <TextItemsList 
            items={logData.actionItems || createDefaultArray()} 
            setItems={(newItems: TextItem[]) => setLogData(prev => ({ ...prev, actionItems: newItems }))} 
            placeholder="Describe action items..."
          />
        </Section>

        {/* Next Day Plan */}
        <Section title="7. Plan for Next Day (All Trades)" icon={Calendar}>
          <TextItemsList 
            items={logData.nextDayPlan || createDefaultArray()} 
            setItems={(newItems: TextItem[]) => setLogData(prev => ({ ...prev, nextDayPlan: newItems }))} 
            placeholder="Describe tomorrow's plan..."
          />
        </Section>

        {/* Notes */}
        <Section 
          title="8. Notes / Observations" 
          icon={Eye}
          showActionButton={true}
          onCreateActionItem={createActionItem}
          sectionType="notes"
        >
          <TextItemsList 
            items={logData.notes || createDefaultArray()} 
            setItems={(newItems: TextItem[]) => setLogData(prev => ({ ...prev, notes: newItems }))} 
            placeholder="Add notes and observations..."
          />
        </Section>
      </div>

      {/* Hidden Print Section */}
      <PrintView ref={printRef} logData={logData} />
    </div>
  );
};

export default ConstructionDailyLog;
