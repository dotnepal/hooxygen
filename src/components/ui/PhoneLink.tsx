import React from 'react';

interface PhoneLinkProps {
  phone: string;
  display?: string;
  className?: string;
  icon?: boolean;
}

/**
 * PhoneLink Component
 * Renders a clickable tel: link for phone numbers
 * On mobile: Opens native dialer
 * On desktop: Opens browser dialer or Skype
 */
export const PhoneLink: React.FC<PhoneLinkProps> = ({
  phone,
  display = phone,
  className = '',
  icon = false,
}) => {
  // Extract the numeric part for aria-label (more readable)
  const formattedForAria = phone.replace(/[^\d+]/g, '');

  return (
    <a
      href={`tel:${phone}`}
      className={className || 'text-brand-blue hover:underline transition-colors'}
      aria-label={`Call ${formattedForAria}`}
      title={`Call ${phone}`}
    >
      {icon && (
        <svg
          className="inline-block w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.472 1.45 1.462 2.732 2.686 3.72.248.207.486.414.71.676l1.615-1.615a1 1 0 011.414 0l3.09 3.09a1 1 0 010 1.422l-4.3 4.3a1 1 0 01-.663.22H5a1 1 0 01-1-1V3z" />
        </svg>
      )}
      {display}
    </a>
  );
};
