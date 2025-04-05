
// components/display/CertificateFile.tsx
interface CertificateFileProps {
    fileId: string;
    name: string;
    className?: string;
  }
  
  export default function CertificateFile({ fileId, name, className = '' }: CertificateFileProps) {
    const fileUrl = `/api/certificates/${fileId}`;
    
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors ${className}`}
      >
        <div className="mr-3 rounded-full p-2 bg-purple-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <line x1="10" y1="9" x2="8" y2="9"></line>
          </svg>
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">View certificate</p>
        </div>
      </a>
    );
  }