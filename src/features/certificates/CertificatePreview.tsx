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
              x="1328"
              y="91"
              fontFamily="Inter, Arial, Helvetica, sans-serif"
              fontSize="30"
              fontWeight="900"
              fill="#000000"
            >
              Reference no. {certificate.referenceNumber}
            </text>

            <text
              x="950"
              y="338"
              textAnchor="middle"
              fontFamily="Inter, Arial, Helvetica, sans-serif"
              fontSize="55"
              fontWeight="900"
              letterSpacing="4"
              fill="#000000"
            >
              APOLLO DRONES ACADEMY
              <tspan baselineShift="super" fontSize="24">
                TM
              </tspan>
            </text>

            <text
              x="950"
              y="485"
              textAnchor="middle"
              fontFamily="'Libre Bodoni', 'Bodoni 72', Didot, Georgia, serif"
              fontSize="78"
              fontWeight="400"
              letterSpacing="17"
              fill="#000000"
            >
              CERTIFICATE OF COMPLETION
            </text>

            <text
              x="950"
              y="610"
              textAnchor="middle"
              fontFamily="Inter, Arial, Helvetica, sans-serif"
              fontSize="34"
              fontWeight="900"
              letterSpacing="18"
              fill="#000000"
            >
              THIS CERTIFICATE IS CERTIFIED TO
            </text>

            <text
              x="950"
              y="710"
              textAnchor="middle"
              fontFamily="'Libre Bodoni', 'Bodoni 72', Didot, Georgia, serif"
              fontSize="76"
              fontWeight="500"
              fill="#8a6519"
            >
              {certificate.studentName}
            </text>

            <text
              x="950"
              y="812"
              textAnchor="middle"
              fontFamily="Inter, Arial, Helvetica, sans-serif"
              fontSize="30"
              fontWeight="400"
              fill="#000000"
            >
              Has successfully completed the course
              <tspan fontWeight="900"> {certificate.courseName}</tspan>
              <tspan> provided by</tspan>
            </text>

            <text
              x="950"
              y="860"
              textAnchor="middle"
              fontFamily="Inter, Arial, Helvetica, sans-serif"
              fontSize="33"
              fontWeight="500"
              fill="#000000"
            >
              APOLLO GLOBAL ACADEMY PTE LTD
            </text>

            <text
              x="748"
              y="1038"
              textAnchor="middle"
              fontFamily="'Great Vibes', 'Segoe Script', 'Brush Script MT', cursive"
              fontSize="78"
              fontWeight="400"
              fill="#000000"
            >
              Alan
            </text>

            <line x1="515" y1="1076" x2="1000" y2="1076" stroke="#000000" strokeWidth="1.5" />
            <text
              x="758"
              y="1122"
              textAnchor="middle"
              fontFamily="Inter, Arial, Helvetica, sans-serif"
              fontSize="29"
              fontWeight="400"
              fill="#000000"
            >
              {certificate.signatoryTitle}
            </text>
            <text
              x="758"
              y="1162"
              textAnchor="middle"
              fontFamily="Inter, Arial, Helvetica, sans-serif"
              fontSize="30"
              fontWeight="900"
              fill="#000000"
            >
              {certificate.signatoryName}
            </text>

            <text
              x="1410"
              y="1038"
              textAnchor="middle"
              fontFamily="Inter, Arial, Helvetica, sans-serif"
              fontSize="31"
              fontWeight="400"
              fill="#000000"
            >
              {formatDate(certificate.issueDate)}
            </text>
            <line x1="1160" y1="1076" x2="1660" y2="1076" stroke="#000000" strokeWidth="1.5" />
            <text
              x="1410"
              y="1140"
              textAnchor="middle"
              fontFamily="Inter, Arial, Helvetica, sans-serif"
              fontSize="30"
              fontWeight="400"
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
