import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useEntitlement } from '../../hooks/useEntitlement';
import { Lock, Share2 } from 'lucide-react';

const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

const getInitialForm = (clients, preselectedClientId) => ({
  clientId:
    preselectedClientId &&
    clients.some(c => c.id === preselectedClientId)
      ? preselectedClientId
      : clients[0]?.id || '',

  templateType: 'General',

  title: '',

  isShared: false,

  sessionDate: getToday(),

  generalText: '',

  subjective: '',
  objective: '',
  assessment: '',
  plan: '',

  data: '',
  dapAssessment: '',
  dapPlan: ''
});

export const QuickNoteModal = ({
  isOpen,
  onClose,
  preselectedClientId = null
}) => {
  const { clients, addNote } = useData();

  const {
    canAccess,
    requireAccess
  } = useEntitlement();

  const [formData, setFormData] = useState(
    getInitialForm(clients, preselectedClientId)
  );

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(
        getInitialForm(clients, preselectedClientId)
      );
    }
  }, [isOpen, clients, preselectedClientId]);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateChange = (type) => {
    if (type === 'SOAP' && !canAccess('soap_notes')) {
      requireAccess(
        'soap_notes',
        'Clinical SOAP Notes'
      );
      return;
    }

    if (type === 'DAP' && !canAccess('dap_notes')) {
      requireAccess(
        'dap_notes',
        'Clinical DAP Documentation'
      );
      return;
    }

    updateField('templateType', type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (clients.length === 0) {
      return;
    }

    const client = clients.find(
      c => c.id === formData.clientId
    );

    if (!client) {
      return;
    }

    let contentObj = {};

    if (formData.templateType === 'General') {
      contentObj = {
        text: formData.generalText.trim()
      };
    }

    if (formData.templateType === 'SOAP') {
      contentObj = {
        subjective: formData.subjective.trim(),
        objective: formData.objective.trim(),
        assessment: formData.assessment.trim(),
        plan: formData.plan.trim()
      };
    }

    if (formData.templateType === 'DAP') {
      contentObj = {
        data: formData.data.trim(),
        assessment: formData.dapAssessment.trim(),
        plan: formData.dapPlan.trim()
      };
    }

    // Require actual content
    const hasContent = Object.values(contentObj).some(
      value =>
        typeof value === 'string' &&
        value.trim().length > 0
    );

    if (!hasContent) {
      return;
    }

    addNote({
      clientId: client.id,
      clientName: client.name,

      sessionDate: formData.sessionDate,

      title:
        formData.title.trim() ||
        `${formData.templateType} Clinical Note - ${formData.sessionDate}`,

      templateType: formData.templateType,

      isShared: formData.isShared,

      content: contentObj
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Clinical Documentation"
      subtitle="Document clinical observations, structured SOAP/DAP notes, or client takeaways"
      maxWidth="max-w-2xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* Client + Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

          <div>
            <label className="block text-xs font-bold text-midnight mb-1">
              Select Client *
            </label>

            <select
              required
              value={formData.clientId}
              onChange={(e) =>
                updateField(
                  'clientId',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
            >
              {clients.map(client => (
                <option
                  key={client.id}
                  value={client.id}
                >
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-midnight mb-1">
              Session Date *
            </label>

            <input
              type="date"
              required
              value={formData.sessionDate}
              onChange={(e) =>
                updateField(
                  'sessionDate',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-midnight mb-1">
            Session Title / Topic
          </label>

          <input
            type="text"
            placeholder="e.g. Session #9: Somatic Anchoring & Exposure Exercise"
            value={formData.title}
            onChange={(e) =>
              updateField(
                'title',
                e.target.value
              )
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
          />
        </div>

        {/* Template */}
        <div>
          <label className="block text-xs font-bold text-midnight mb-1.5">
            Note Template Format
          </label>

          <div className="grid grid-cols-3 gap-2">

            <button
              type="button"
              onClick={() =>
                handleTemplateChange('General')
              }
              className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                formData.templateType === 'General'
                  ? 'bg-rosewood text-white border-rosewood'
                  : 'bg-white text-midnight border-misty/40 hover:bg-vanilla'
              }`}
            >
              General Freeform
            </button>

            <button
              type="button"
              onClick={() =>
                handleTemplateChange('SOAP')
              }
              className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition relative ${
                formData.templateType === 'SOAP'
                  ? 'bg-rosewood text-white border-rosewood'
                  : 'bg-white text-midnight border-misty/40 hover:bg-vanilla'
              }`}
            >
              SOAP Protocol

              {!canAccess('soap_notes') && (
                <span className="ml-1 text-[10px] text-blush font-normal">
                  🔒 Pro
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                handleTemplateChange('DAP')
              }
              className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition relative ${
                formData.templateType === 'DAP'
                  ? 'bg-rosewood text-white border-rosewood'
                  : 'bg-white text-midnight border-misty/40 hover:bg-vanilla'
              }`}
            >
              DAP Structure

              {!canAccess('dap_notes') && (
                <span className="ml-1 text-[10px] text-blush font-normal">
                  🔒 Pro
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="p-3.5 rounded-2xl bg-vanilla/60 border border-misty/30 flex items-center justify-between">

          <div className="flex items-center gap-2.5">

            <div
              className={`p-2 rounded-xl ${
                formData.isShared
                  ? 'bg-sage-light text-sage-dark'
                  : 'bg-rosewood-light text-rosewood'
              }`}
            >
              {formData.isShared ? (
                <Share2 size={18} />
              ) : (
                <Lock size={18} />
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-midnight">
                {formData.isShared
                  ? 'SHARED NOTE (Client Can View in Portal)'
                  : 'PRIVATE CLINICAL NOTE (Therapist Only)'}
              </p>

              <p className="text-[11px] text-midnight-muted">
                {formData.isShared
                  ? 'Published directly to the client’s portal as takeaways or homework.'
                  : 'Encrypted and strictly restricted to your therapist dashboard.'}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">

            <input
              type="checkbox"
              checked={formData.isShared}
              onChange={(e) =>
                updateField(
                  'isShared',
                  e.target.checked
                )
              }
              className="sr-only peer"
            />

            <div className="w-11 h-6 bg-misty/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage" />
          </label>
        </div>

        {/* General */}
        {formData.templateType === 'General' && (
          <div>
            <label className="block text-xs font-bold text-midnight mb-1">
              Session Notes & Observations
            </label>

            <textarea
              rows={5}
              required
              placeholder="Record clinical impressions, interventions used, client responses, and assigned homework..."
              value={formData.generalText}
              onChange={(e) =>
                updateField(
                  'generalText',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood resize-none"
            />
          </div>
        )}

        {/* SOAP */}
        {formData.templateType === 'SOAP' && (
          <div className="space-y-2.5">

            <div>
              <label className="block text-[11px] font-bold text-midnight mb-0.5">
                S - Subjective (Client's report & self-assessment)
              </label>

              <textarea
                rows={2}
                required
                placeholder="Client reports..."
                value={formData.subjective}
                onChange={(e) =>
                  updateField(
                    'subjective',
                    e.target.value
                  )
                }
                className="w-full px-3 py-1.5 rounded-xl border border-misty/50 text-xs focus:outline-none focus:border-rosewood"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-midnight mb-0.5">
                O - Objective
              </label>

              <textarea
                rows={2}
                required
                placeholder="Therapist observations..."
                value={formData.objective}
                onChange={(e) =>
                  updateField(
                    'objective',
                    e.target.value
                  )
                }
                className="w-full px-3 py-1.5 rounded-xl border border-misty/50 text-xs focus:outline-none focus:border-rosewood"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-midnight mb-0.5">
                A - Assessment
              </label>

              <textarea
                rows={2}
                required
                placeholder="Clinical assessment..."
                value={formData.assessment}
                onChange={(e) =>
                  updateField(
                    'assessment',
                    e.target.value
                  )
                }
                className="w-full px-3 py-1.5 rounded-xl border border-misty/50 text-xs focus:outline-none focus:border-rosewood"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-midnight mb-0.5">
                P - Plan
              </label>

              <textarea
                rows={2}
                required
                placeholder="Treatment plan..."
                value={formData.plan}
                onChange={(e) =>
                  updateField(
                    'plan',
                    e.target.value
                  )
                }
                className="w-full px-3 py-1.5 rounded-xl border border-misty/50 text-xs focus:outline-none focus:border-rosewood"
              />
            </div>
          </div>
        )}

        {/* DAP */}
        {formData.templateType === 'DAP' && (
          <div className="space-y-2.5">

            <div>
              <label className="block text-[11px] font-bold text-midnight mb-0.5">
                D - Data
              </label>

              <textarea
                rows={3}
                required
                placeholder="Specific interventions, client statements, behavioral data..."
                value={formData.data}
                onChange={(e) =>
                  updateField(
                    'data',
                    e.target.value
                  )
                }
                className="w-full px-3 py-1.5 rounded-xl border border-misty/50 text-xs focus:outline-none focus:border-rosewood"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-midnight mb-0.5">
                A - Assessment
              </label>

              <textarea
                rows={2}
                required
                placeholder="Clinical insight & evaluation..."
                value={formData.dapAssessment}
                onChange={(e) =>
                  updateField(
                    'dapAssessment',
                    e.target.value
                  )
                }
                className="w-full px-3 py-1.5 rounded-xl border border-misty/50 text-xs focus:outline-none focus:border-rosewood"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-midnight mb-0.5">
                P - Plan
              </label>

              <textarea
                rows={2}
                required
                placeholder="Immediate action items & goals..."
                value={formData.dapPlan}
                onChange={(e) =>
                  updateField(
                    'dapPlan',
                    e.target.value
                  )
                }
                className="w-full px-3 py-1.5 rounded-xl border border-misty/50 text-xs focus:outline-none focus:border-rosewood"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-misty/20">

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-midnight hover:bg-vanilla transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={clients.length === 0}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-rosewood text-white hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Clinical Note
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default QuickNoteModal;