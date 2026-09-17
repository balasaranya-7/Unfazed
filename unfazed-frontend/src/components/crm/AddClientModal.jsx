import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';

// ============================================================
// Gender-based avatar pools
// ============================================================

const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
];

const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=200&auto=format&fit=crop&q=80'
];

const PERSON_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';


// ============================================================
// Get a NEW avatar for the selected gender
// ============================================================

const getGenderAvatar = (gender, existingClients) => {
  let avatarPool = [];

  if (gender === 'Male') {
    avatarPool = MALE_AVATARS;
  } else if (gender === 'Female') {
    avatarPool = FEMALE_AVATARS;
  } else {
    return PERSON_AVATAR;
  }

  // Existing avatars of same gender
  const usedAvatars = new Set(
    existingClients
      .filter((client) => client.gender === gender)
      .map((client) => client.avatar)
      .filter(Boolean)
  );

  // First preference:
  // Pick an avatar which hasn't been used yet.
  const unusedAvatar = avatarPool.find(
    (avatar) => !usedAvatars.has(avatar)
  );

  if (unusedAvatar) {
    return unusedAvatar;
  }

  // If every avatar in the pool has already been used,
  // choose one based on the current client count.
  const genderClients = existingClients.filter(
    (client) => client.gender === gender
  );

  const index =
    genderClients.length % avatarPool.length;

  return avatarPool[index];
};


// ============================================================
// Add Client Modal
// ============================================================

export const AddClientModal = ({
  isOpen,
  onClose
}) => {

  const {
    addClient,
    clients,
    packages,
    showToast
  } = useData();


  // ==========================================================
  // Initial Form
  // ==========================================================

  const initialFormData = {
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Female',
    occupation: '',
    location: 'Bengaluru, KA',
    primaryConcern: '',
    tags: 'Anxiety, CBT',
    preferredMode: 'Online Video',

    status: 'Active',

    packageId: '',

    lastSession: '',

    nextSession: ''
  };


  const [formData, setFormData] = useState(
    initialFormData
  );


  // ==========================================================
  // Handle Change
  // ==========================================================

  const handleChange = (
    field,
    value
  ) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };


  // ==========================================================
  // Submit
  // ==========================================================

  const handleSubmit = (e) => {

    e.preventDefault();


    // --------------------------------------------------------
    // Required fields
    // --------------------------------------------------------

    if (
      !formData.name.trim() ||
      !formData.email.trim()
    ) {

      showToast(
        'Please enter the client name and email.',
        'error'
      );

      return;
    }


    // --------------------------------------------------------
    // Phone validation
    // --------------------------------------------------------

    const phone =
      formData.phone.trim();


    if (
      phone &&
      phone.length !== 10
    ) {

      showToast(
        'Phone number must contain exactly 10 digits.',
        'error'
      );

      return;
    }


    // --------------------------------------------------------
    // Find selected package
    // --------------------------------------------------------

    const selectedPackage =
      formData.packageId
        ? packages.find(
            (pkg) =>
              String(pkg.id) ===
              String(formData.packageId)
          )
        : null;


    // --------------------------------------------------------
    // Build client package
    // --------------------------------------------------------

    let clientPackage = null;


    if (selectedPackage) {

      const sessionCount =
        Number(
          selectedPackage.sessionCount
        ) || 0;


      clientPackage = {

        id:
          selectedPackage.id,

        title:
          selectedPackage.name,

        total:
          sessionCount,

        used:
          0,

        remaining:
          sessionCount,

        expiryDate:
          null,

        status:
          selectedPackage.status ||
          'Active'
      };
    }


    // --------------------------------------------------------
    // Get NEW gender-based avatar
    // --------------------------------------------------------

    const avatar =
      getGenderAvatar(
        formData.gender,
        clients
      );


    // --------------------------------------------------------
    // Tags
    // --------------------------------------------------------

    const tags =
      formData.tags
        .split(',')
        .map(
          (tag) => tag.trim()
        )
        .filter(Boolean);


    // --------------------------------------------------------
    // Add client
    // --------------------------------------------------------

    addClient({

      name:
        formData.name.trim(),

      email:
        formData.email.trim(),

      phone:
        phone || '',

      age:
        formData.age
          ? parseInt(
              formData.age,
              10
            )
          : null,

      gender:
        formData.gender,

      occupation:
        formData.occupation.trim() ||
        'Professional',

      location:
        formData.location.trim() ||
        'Bengaluru, KA',

      status:
        formData.status,

      avatar,

      tags,

      lastSession:
        formData.lastSession ||
        null,

      nextSession:
        formData.nextSession ||
        null,

      package:
        clientPackage,

      paymentStatus:
        'Pending',

      consentSigned:
        false,

      consentDate:
        null,

      intakeSummary: {

        primaryConcern:
          formData.primaryConcern.trim() ||
          'Initial therapy inquiry.',

        medicalHistory:
          'None reported.',

        emergencyContact:
          'Not specified',

        preferredMode:
          formData.preferredMode
      }
    });


    // --------------------------------------------------------
    // Reset
    // --------------------------------------------------------

    setFormData({
      ...initialFormData
    });


    onClose();
  };


  // ==========================================================
  // JSX
  // ==========================================================

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Client to Practice"
      subtitle="Create a new client profile with intake notes and contact details"
      maxWidth="max-w-xl"
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* Name + Email */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

          <div>

            <label className="block text-xs font-bold text-midnight mb-1">
              Full Name *
            </label>

            <input
              type="text"
              required
              placeholder="e.g. Samaira Rao"
              value={formData.name}
              onChange={(e) =>
                handleChange(
                  'name',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />

          </div>


          <div>

            <label className="block text-xs font-bold text-midnight mb-1">
              Email Address *
            </label>

            <input
              type="email"
              required
              placeholder="samaira.rao@gmail.com"
              value={formData.email}
              onChange={(e) =>
                handleChange(
                  'email',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />

          </div>

        </div>


        {/* Phone + Age + Gender */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">

          <div>

            <label className="block text-xs font-bold text-midnight mb-1">
              Phone Number
            </label>

            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) => {

                const value =
                  e.target.value
                    .replace(/\D/g, '')
                    .slice(0, 10);

                handleChange(
                  'phone',
                  value
                );
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />

            <p className="text-[10px] text-midnight-muted mt-1">
              Enter exactly 10 digits
            </p>

          </div>


          <div>

            <label className="block text-xs font-bold text-midnight mb-1">
              Age
            </label>

            <input
              type="number"
              min="1"
              max="120"
              placeholder="29"
              value={formData.age}
              onChange={(e) =>
                handleChange(
                  'age',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />

          </div>


          <div>

            <label className="block text-xs font-bold text-midnight mb-1">
              Gender
            </label>

            <select
              value={formData.gender}
              onChange={(e) =>
                handleChange(
                  'gender',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
            >

              <option value="Female">
                Female
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Non-Binary">
                Non-Binary
              </option>

              <option value="Couple">
                Couple
              </option>

            </select>

          </div>

        </div>


        {/* Occupation + Status */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

          <div>

            <label className="block text-xs font-bold text-midnight mb-1">
              Occupation
            </label>

            <input
              type="text"
              placeholder="e.g. Senior Software Architect"
              value={formData.occupation}
              onChange={(e) =>
                handleChange(
                  'occupation',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />

          </div>


          <div>

            <label className="block text-xs font-bold text-midnight mb-1">
              Status
            </label>

            <select
              value={formData.status}
              onChange={(e) =>
                handleChange(
                  'status',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
            >

              <option value="Active">
                Active
              </option>

              <option value="Lead">
                Lead
              </option>

              <option value="Paused">
                Paused
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

          </div>

        </div>


        {/* Package + Preferred Mode */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

          <div>

            <label className="block text-xs font-bold text-midnight mb-1">

              Package

              <span className="font-normal text-midnight-muted">
                {' '}(Optional)
              </span>

            </label>


            <select
              value={formData.packageId}
              onChange={(e) =>
                handleChange(
                  'packageId',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
            >

              <option value="">
                No Package
              </option>


              {packages
                .filter(
                  (pkg) =>
                    !pkg.status ||
                    pkg.status === 'Active'
                )
                .map((pkg) => (

                  <option
                    key={pkg.id}
                    value={pkg.id}
                  >

                    {pkg.name}

                    {pkg.sessionCount
                      ? ` — ${pkg.sessionCount} Sessions`
                      : ''}

                  </option>

                ))}

            </select>


            {packages.length === 0 && (

              <p className="text-[11px] text-midnight-muted mt-1">
                No packages available. You can add packages from the Packages page.
              </p>

            )}

          </div>


          <div>

            <label className="block text-xs font-bold text-midnight mb-1">
              Preferred Mode
            </label>

            <select
              value={formData.preferredMode}
              onChange={(e) =>
                handleChange(
                  'preferredMode',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
            >

              <option value="Online Video">
                Online Video
              </option>

              <option value="In-Person Clinic">
                In-Person Clinic
              </option>

              <option value="Phone Call">
                Phone Call
              </option>

            </select>

          </div>

        </div>


        {/* Last + Next Session */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

          <div>

            <label className="block text-xs font-bold text-midnight mb-1">

              Last Session

              <span className="font-normal text-midnight-muted">
                {' '}(Optional)
              </span>

            </label>

            <input
              type="date"
              value={formData.lastSession}
              onChange={(e) =>
                handleChange(
                  'lastSession',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
            />

          </div>


          <div>

            <label className="block text-xs font-bold text-midnight mb-1">

              Next Session

              <span className="font-normal text-midnight-muted">
                {' '}(Optional)
              </span>

            </label>

            <input
              type="datetime-local"
              value={formData.nextSession}
              onChange={(e) =>
                handleChange(
                  'nextSession',
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
            />

          </div>

        </div>


        {/* Tags */}

        <div>

          <label className="block text-xs font-bold text-midnight mb-1">
            Clinical Tags (Comma separated)
          </label>

          <input
            type="text"
            placeholder="Anxiety, Perfectionism, ACT"
            value={formData.tags}
            onChange={(e) =>
              handleChange(
                'tags',
                e.target.value
              )
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
          />

        </div>


        {/* Primary Concern */}

        <div>

          <label className="block text-xs font-bold text-midnight mb-1">
            Primary Concern / Initial Intake
          </label>

          <textarea
            rows={3}
            placeholder="Describe presenting symptoms, key goals for therapy, or intake history..."
            value={formData.primaryConcern}
            onChange={(e) =>
              handleChange(
                'primaryConcern',
                e.target.value
              )
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood resize-none"
          />

        </div>


        {/* Actions */}

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
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-rosewood text-white hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20"
          >
            Save Client
          </button>

        </div>

      </form>

    </Modal>
  );
};


export default AddClientModal;