
import React from 'react';

export const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 19.695 4.032 22.5 8.25c-1.126-2.263-3.48-3.64-6.04-3.64-1.48 0-2.853.5-3.96 1.332-2.149 1.602-2.78 4.38-1.886 6.532-.476.093-.94.22-1.38.382-2.43.903-4.114 3.34-4.114 6.018 0 2.828 2.09 5.143 4.785 5.564a.75.75 0 01.32.934c-.187.34-.52.553-.89.553a.75.75 0 01-.722-.55C5.07 21.45 2.25 18.083 2.25 14.25c0-4.132 3.368-7.5 7.5-7.5 1.141 0 2.222.254 3.208.723-.553-1.018-.792-2.223-.743-3.438zM21 14.25c0-2.263-1.576-4.183-3.75-4.665a.75.75 0 00-.63.139c-.233.16-.39.41-.39.685 0 .414.336.75.75.75h.75c1.24 0 2.25 1.01 2.25 2.25S19.24 16.5 18 16.5h-.75a.75.75 0 00-.75.75c0 .275.157.525.39.685a.75.75 0 00.63.139C19.424 18.433 21 16.513 21 14.25z"
      clipRule="evenodd"
    />
  </svg>
);

export const CameraIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008v-.008z"
    />
  </svg>
);

export const UploadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);
