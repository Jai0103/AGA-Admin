import type { CertificateRecord } from "./certificate.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

type CertificatePreviewProps = {
  certificate: CertificateRecord;
};

export function CertificatePreview({ certificate }: CertificatePreviewProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-panel dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="relative aspect-[1900/1350] overflow-hidden rounded-lg bg-white text-black">
          <img
            src="/AGA-Admin/certificates/uapl-theory-course-template.png"
            alt="UAPL Theory Course certificate template"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1900 1350"
            role="img"
            aria-label={`Certificate preview for ${certificate.studentName}`}
          >
            <text
              x="1315"
              y="96"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="30"
              fontWeight="800"
              fill="#000000"
            >
              Reference no. {certificate.referenceNumber}
            </text>

            <text
              x="950"
              y="345"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="54"
              fontWeight="900"
              letterSpacing="3"
              fill="#000000"
            >
              APOLLO DRONES ACADEMY
              <tspan baselineShift="super" fontSize="26">
                TM
              </tspan>
            </text>

            <text
              x="950"
              y="490"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="82"
              fontWeight="400"
              letterSpacing="15"
              fill="#000000"
            >
              CERTIFICATE OF COMPLETION
            </text>

            <text
              x="950"
              y="615"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="34"
              fontWeight="900"
              letterSpacing="13"
              fill="#000000"
            >
              THIS CERTIFICATE IS CERTIFIED TO
            </text>

            <text
              x="950"
              y="720"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="82"
              fontWeight="400"
              fill="#8a6519"
            >
              {certificate.studentName}
            </text>

            <text
              x="950"
              y="815"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="31"
              fill="#000000"
            >
              Has successfully completed the course
              <tspan fontWeight="900"> {certificate.courseName}</tspan>
              <tspan> provided by</tspan>
            </text>

            <text
              x="950"
              y="865"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="34"
              fill="#000000"
            >
              APOLLO GLOBAL ACADEMY PTE LTD
            </text>

            <text
              x="750"
              y="1045"
              textAnchor="middle"
              fontFamily="Brush Script MT, Segoe Script, cursive"
              fontSize="70"
              fontStyle="italic"
              fill="#000000"
            >
              Alan
            </text>

            <line x1="520" y1="1075" x2="1000" y2="1075" stroke="#000000" strokeWidth="1.5" />
            <text
              x="760"
              y="1120"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="30"
              fill="#000000"
            >
              {certificate.signatoryTitle}
            </text>
            <text
              x="760"
              y="1162"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="31"
              fontWeight="900"
              fill="#000000"
            >
              {certificate.signatoryName}
            </text>

            <text
              x="1418"
              y="1045"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="32"
              fill="#000000"
            >
              {formatDate(certificate.issueDate)}
            </text>
            <line x1="1165" y1="1075" x2="1660" y2="1075" stroke="#000000" strokeWidth="1.5" />
            <text
              x="1418"
              y="1140"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="30"
              fill="#000000"
            >
              Date
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
