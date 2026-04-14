import React from 'react';

interface PhoneLinkProps {
  phone: string;
  display?: string;
  className?: string;
  icon?: boolean;
  type?: 'button' | 'link';
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
  icon = false,
  type = 'button',
}) => {
  // Extract the numeric part for aria-label (more readable)
  const formattedForAria = phone.replace(/[^\d+]/g, '');

  return (
    <a
      href={`tel:${phone}`}
      className={type === 'button' ? 'inline-flex items-center gap-2 sm:gap-2 bg-brand-blue text-white font-display font-semibold hover:bg-brand-dark transition-all hover:shadow-lg text-sm sm:text-base lg:text-lg rounded-md sm:rounded-lg lg:rounded-xl px-4 py-3 sm:px-6 sm:py-3 lg:px-8 lg:py-4' : ''}
      aria-label={`Call ${formattedForAria}`}
      title={`Call ${phone}`}
    >
      {icon && (
        // <svg
        //   className="inline-block w-5 h-5 mr-2"
        //   fill="currentColor"
        //   viewBox="0 0 20 20"
        //   xmlns="http://www.w3.org/2000/svg"
        //   aria-hidden="true"
        // >
        //   <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.472 1.45 1.462 2.732 2.686 3.72.248.207.486.414.71.676l1.615-1.615a1 1 0 011.414 0l3.09 3.09a1 1 0 010 1.422l-4.3 4.3a1 1 0 01-.663.22H5a1 1 0 01-1-1V3z" />
        // </svg>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className='w-5 sm:w-6'>
          <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/>
        </svg>
      )}
      {display}
    </a>
  );
};
