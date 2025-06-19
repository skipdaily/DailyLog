'use client'

import React, { useState, useRef } from 'react';
import { Plus, Trash2, Download, Save, Users, Building2, Calendar, FileText, AlertTriangle, MessageSquare, Wrench, CheckSquare, Eye, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Define our types
interface Crew {
  name: string;
  members: string[];
}

type SetStateAction<T> = React.Dispatch<React.SetStateAction<T>>;

interface SectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

interface TextAreaFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}

const ConstructionDailyLog = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [superintendentName, setSuperintendentName] = useState('');
  const [projectName, setProjectName] = useState('');
  
  // Manage subcontractors and crews
  const [subcontractors, setSubcontractors] = useState<string[]>(['MTI', 'OJV']);
  const [crews, setCrews] = useState<Crew[]>([
    { name: 'Crew 1', members: ['Tom Yanky', 'Deven Stroud'] },
    { name: 'Crew 2', members: ['Jim Hardy'] }
  ]);
  const [newSubcontractor, setNewSubcontractor] = useState('');
  const [newCrew, setNewCrew] = useState('');
  const [newMember, setNewMember] = useState('');
  const [selectedCrewIndex, setSelectedCrewIndex] = useState(0);
  
  // Form sections
  const [workPerformed, setWorkPerformed] = useState<string[]>(['']);
  const [delays, setDelays] = useState<string[]>(['']);
  const [tradesOnsite, setTradesOnsite] = useState<string[]>(['']);
  const [meetings, setMeetings] = useState<string[]>(['']);
  const [outOfScope, setOutOfScope] = useState<string[]>(['']);
  const [actionItems, setActionItems] = useState<string[]>(['']);
  const [nextDayPlan, setNextDayPlan] = useState<string[]>(['']);
  const [notes, setNotes] = useState<string[]>(['']);
  
  const printRef = useRef<HTMLDivElement>(null);

  const addSubcontractor = () => {
    if (newSubcontractor.trim()) {
      setSubcontractors([...subcontractors, newSubcontractor.trim()]);
      setNewSubcontractor('');
    }
  };

  const addCrew = () => {
    if (newCrew.trim()) {
      setCrews([...crews, { name: newCrew.trim(), members: [] }]);
      setNewCrew('');
    }
  };

  const removeSubcontractor = (index: number) => {
    setSubcontractors(subcontractors.filter((_, i) => i !== index));
  };

  const removeCrew = (index: number) => {
    setCrews(crews.filter((_, i) => i !== index));
  };

  const addMemberToCrew = (crewIndex: number) => {
    if (newMember.trim()) {
      const updatedCrews = [...crews];
      updatedCrews[crewIndex].members.push(newMember.trim());
      setCrews(updatedCrews);
      setNewMember('');
    }
  };

  const removeMemberFromCrew = (crewIndex: number, memberIndex: number) => {
    const updatedCrews = [...crews];
    updatedCrews[crewIndex].members = updatedCrews[crewIndex].members.filter((_, i) => i !== memberIndex);
    setCrews(updatedCrews);
  };

  const addField = (setter: SetStateAction<string[]>, current: string[]) => {
    setter([...current, '']);
  };

  const updateField = (setter: SetStateAction<string[]>, current: string[], index: number, value: string) => {
    const updated = [...current];
    updated[index] = value;
    setter(updated);
  };

  const removeField = (setter: SetStateAction<string[]>, current: string[], index: number) => {
    if (current.length > 1) {
      setter(current.filter((_, i: number) => i !== index));
    }
  };

  const handleSubmit = async () => {
    // This will be replaced with Supabase integration
    console.log('Saving daily log to Supabase...');
    
    const logData = {
      date: currentDate,
      superintendentName,
      projectName,
      subcontractors,
      crews,
      workPerformed: workPerformed.filter(item => item.trim()),
      delays: delays.filter(item => item.trim()),
      tradesOnsite: tradesOnsite.filter(item => item.trim()),
      meetings: meetings.filter(item => item.trim()),
      outOfScope: outOfScope.filter(item => item.trim()),
      actionItems: actionItems.filter(item => item.trim()),
      nextDayPlan: nextDayPlan.filter(item => item.trim()),
      notes: notes.filter(item => item.trim()),
    };
    
    console.log('Log data:', logData);
    
    // For now, just alert success
    alert('Daily log saved successfully!');
  };

  const exportToPDF = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    document.title = `Daily Log - ${projectName} - ${currentDate}`;
    
    window.print();
    
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: '2-digit', 
      month: 'numeric', 
      day: 'numeric' 
    });
  };

  const Section: React.FC<SectionProps> = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const TextAreaField: React.FC<TextAreaFieldProps> = ({ value, onChange, placeholder, rows = 3 }) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
    />
  );

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
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Superintendent Name</label>
              <input
                type="text"
                value={superintendentName}
                onChange={(e) => setSuperintendentName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Manage Subcontractors and Crews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Section title="Manage Subcontractors" icon={Users}>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSubcontractor}
                onChange={(e) => setNewSubcontractor(e.target.value)}
                placeholder="Add subcontractor"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addSubcontractor}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {subcontractors.map((sub, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span>{sub}</span>
                  <button
                    onClick={() => removeSubcontractor(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Manage Crews" icon={Users}>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newCrew}
                onChange={(e) => setNewCrew(e.target.value)}
                placeholder="Add crew name"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addCrew}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {crews.map((crew, crewIndex) => (
                <div key={crewIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{crew.name}</h4>
                    <button
                      onClick={() => removeCrew(crewIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Add Member */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newMember}
                      onChange={(e) => setNewMember(e.target.value)}
                      placeholder="Add team member"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => addMemberToCrew(crewIndex)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Members List */}
                  <div className="space-y-2">
                    {crew.members.map((member, memberIndex) => (
                      <div key={memberIndex} className="flex items-center justify-between p-2 bg-white rounded-md border">
                        <span className="text-sm">{member}</span>
                        <button
                          onClick={() => removeMemberFromCrew(crewIndex, memberIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {crew.members.length === 0 && (
                      <p className="text-gray-500 text-sm italic">No team members added yet</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Work Performed */}
        <Section title="1. Work Performed (All Trades)" icon={Wrench}>
          {workPerformed.map((work, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <TextAreaField
                value={work}
                onChange={(value) => updateField(setWorkPerformed, workPerformed, index, value)}
                placeholder="Describe work performed..."
              />
              <button
                onClick={() => removeField(setWorkPerformed, workPerformed, index)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addField(setWorkPerformed, workPerformed)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Work Item
          </button>
        </Section>

        {/* Delays */}
        <Section title="2. Delays / Disruptions" icon={AlertTriangle}>
          {delays.map((delay, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <TextAreaField
                value={delay}
                onChange={(value) => updateField(setDelays, delays, index, value)}
                placeholder="Describe delays or disruptions..."
              />
              <button
                onClick={() => removeField(setDelays, delays, index)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addField(setDelays, delays)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Delay
          </button>
        </Section>

        {/* Trades Onsite */}
        <Section title="3. Trades Onsite" icon={Users}>
          {tradesOnsite.map((trade, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                value={trade}
                onChange={(e) => updateField(setTradesOnsite, tradesOnsite, index, e.target.value)}
                placeholder="Enter trade name (e.g., JLS, HTI - windows and sliders, OJV - Sheet Metal)"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => removeField(setTradesOnsite, tradesOnsite, index)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addField(setTradesOnsite, tradesOnsite)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Trade
          </button>
        </Section>

        {/* Meetings */}
        <Section title="4. Meetings / Discussions" icon={MessageSquare}>
          {meetings.map((meeting, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <TextAreaField
                value={meeting}
                onChange={(value) => updateField(setMeetings, meetings, index, value)}
                placeholder="Describe meetings and discussions..."
                rows={4}
              />
              <button
                onClick={() => removeField(setMeetings, meetings, index)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addField(setMeetings, meetings)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Meeting
          </button>
        </Section>

        {/* Out of Scope */}
        <Section title="5. Out-of-Scope / Extra Work Identified" icon={FileText}>
          {outOfScope.map((item, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <TextAreaField
                value={item}
                onChange={(value) => updateField(setOutOfScope, outOfScope, index, value)}
                placeholder="Describe out-of-scope or extra work..."
              />
              <button
                onClick={() => removeField(setOutOfScope, outOfScope, index)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addField(setOutOfScope, outOfScope)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </Section>

        {/* Action Items */}
        <Section title="6. Action Items" icon={CheckSquare}>
          {actionItems.map((item, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <TextAreaField
                value={item}
                onChange={(value) => updateField(setActionItems, actionItems, index, value)}
                placeholder="Describe action items..."
              />
              <button
                onClick={() => removeField(setActionItems, actionItems, index)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addField(setActionItems, actionItems)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Action Item
          </button>
        </Section>

        {/* Next Day Plan */}
        <Section title="7. Plan for Next Day (All Trades)" icon={Calendar}>
          {nextDayPlan.map((plan, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <TextAreaField
                value={plan}
                onChange={(value) => updateField(setNextDayPlan, nextDayPlan, index, value)}
                placeholder="Describe tomorrow's plan..."
              />
              <button
                onClick={() => removeField(setNextDayPlan, nextDayPlan, index)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addField(setNextDayPlan, nextDayPlan)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Plan Item
          </button>
        </Section>

        {/* Notes */}
        <Section title="8. Notes / Observations" icon={Eye}>
          {notes.map((note, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <TextAreaField
                value={note}
                onChange={(value) => updateField(setNotes, notes, index, value)}
                placeholder="Add notes and observations..."
              />
              <button
                onClick={() => removeField(setNotes, notes, index)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addField(setNotes, notes)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </button>
        </Section>
      </div>

      {/* Hidden Print Section */}
      <div ref={printRef} className="hidden print:block">
        <div className="max-w-4xl mx-auto p-8 bg-white">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-4">DAILY LOG</h1>
            <div className="text-left">
              <p><strong>Daily Log Date:</strong> {formatDate(currentDate)} <strong>Prepared By:</strong> {superintendentName} <strong>Project / Worksite:</strong> {projectName}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">1. Work Performed (All Trades)</h3>
              <ul className="list-disc list-inside space-y-1">
                {workPerformed.filter(item => item.trim()).map((work, index) => (
                  <li key={index}>{work}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">2. Delays / Disruptions</h3>
              <ul className="list-disc list-inside space-y-1">
                {delays.filter(item => item.trim()).map((delay, index) => (
                  <li key={index}>{delay}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">3. Trades Onsite</h3>
              <ul className="list-disc list-inside space-y-1">
                {tradesOnsite.filter(item => item.trim()).map((trade, index) => (
                  <li key={index}>{trade}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">4. Meetings / Discussions</h3>
              <div className="space-y-2">
                {meetings.filter(item => item.trim()).map((meeting, index) => (
                  <div key={index} className="whitespace-pre-wrap">{meeting}</div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">5. Out-of-Scope / Extra Work Identified</h3>
              <ul className="list-disc list-inside space-y-1">
                {outOfScope.filter(item => item.trim()).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">6. Action Items</h3>
              <ul className="list-disc list-inside space-y-1">
                {actionItems.filter(item => item.trim()).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">7. Plan for Next Day (All Trades)</h3>
              <ul className="list-disc list-inside space-y-1">
                {nextDayPlan.filter(item => item.trim()).map((plan, index) => (
                  <li key={index}>{plan}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">8. Notes / Observations</h3>
              <div className="space-y-2">
                {notes.filter(item => item.trim()).map((note, index) => (
                  <div key={index} className="whitespace-pre-wrap">{note}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionDailyLog;
