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
    <div className="overflow-auto rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-panel dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto w-[1100px] max-w-full">
        <div className="relative aspect-[1900/1350] overflow-hidden bg-white text-black">
          <img
            src="/AGA-Admin/certificates/uapl-theory-course-template.png"
            alt="UAPL Theory Course certificate template"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <p className="absolute right-[10.5%] top-[5.7%] text-[1.35vw] font-black">
            Reference no. {certificate.referenceNumber}
          </p>

          <div className="absolute left-0 right-0 top-[22.2%] text-center">
            <p className="text-[2.55vw] font-black tracking-[0.04em]">
              APOLLO DRONES ACADEMY <sup className="text-[1.25vw]">TM</sup>
            </p>
          </div>

          <div className="absolute left-0 right-0 top-[31.7%] text-center">
            <h3 className="font-serif text-[4.15vw] tracking-[0.13em]">
              CERTIFICATE OF COMPLETION
            </h3>
          </div>

          <div className="absolute left-0 right-0 top-[43.2%] text-center">
            <p className="text-[1.9vw] font-black tracking-[0.28em]">
              THIS CERTIFICATE IS CERTIFIED TO
            </p>
          </div>

          <div className="absolute left-[20%] right-[20%] top-[49.4%] text-center">
            <p className="truncate font-serif text-[4.25vw] text-[#8a6519]">
              {certificate.studentName}
            </p>
          </div>

          <div className="absolute left-[18%] right-[18%] top-[59.1%] text-center">
            <p className="text-[1.55vw] leading-snug">
              Has successfully completed the course{" "}
              <strong>{certificate.courseName}</strong> provided by
            </p>
            <p className="mt-[0.4%] text-[1.75vw]">
              APOLLO GLOBAL ACADEMY PTE LTD
            </p>
          </div>

          <div className="absolute bottom-[14.9%] left-[31%] w-[25.5%] text-center">
            <div className="mx-auto h-[3.5vw] w-[50%] font-serif text-[2.8vw] italic leading-[3.5vw]">
              Alan
            </div>
          </div>

          <div className="absolute bottom-[8.7%] left-[29.2%] w-[28.5%] text-center">
            <div className="border-t border-black pt-[0.8vw]">
              <p className="text-[1.55vw]">{certificate.signatoryTitle}</p>
              <p className="text-[1.55vw] font-black">
                {certificate.signatoryName}
              </p>
            </div>
          </div>

          <div className="absolute bottom-[8.7%] right-[10.2%] w-[28.5%] text-center">
            <p className="h-[4.2vw] text-[1.75vw] leading-[4.2vw]">
              {formatDate(certificate.issueDate)}
            </p>
            <div className="border-t border-black pt-[0.8vw] text-[1.55vw]">
              Date
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
