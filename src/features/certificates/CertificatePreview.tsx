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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-panel dark:border-white/10 dark:bg-slate-950">
      <div className="relative aspect-[1.414/1] overflow-hidden bg-white text-black">
        <div className="absolute inset-3 border-[3px] border-[#b9851f]" />

        <div className="absolute -left-10 top-14 h-[3px] w-[55%] -rotate-12 bg-[#d5a333]" />
        <div className="absolute -left-8 top-28 h-[3px] w-[42%] -rotate-45 bg-[#f1d76a]" />
        <div className="absolute -right-14 bottom-16 h-[3px] w-[50%] -rotate-12 bg-[#d5a333]" />
        <div className="absolute -right-10 bottom-28 h-[3px] w-[40%] -rotate-45 bg-[#f1d76a]" />

        <div className="absolute left-1/2 top-[8%] w-[25%] -translate-x-1/2">
          <img
            src="/AGA-Admin/aga-logo-horizontal.png"
            alt="Apollo Global Academy"
            className="w-full object-contain"
          />
        </div>

        <p className="absolute right-[10%] top-[8%] text-[1.6vw] font-black">
          Reference no. {certificate.referenceNumber}
        </p>

        <div className="absolute inset-x-[8%] top-[24%] text-center">
          <p className="text-[3vw] font-black tracking-wide">
            APOLLO DRONES ACADEMY TM
          </p>
          <h3 className="mt-[5%] font-serif text-[5vw] tracking-[0.12em]">
            CERTIFICATE OF COMPLETION
          </h3>
          <p className="mt-[6%] text-[2.4vw] font-black tracking-[0.28em]">
            THIS CERTIFICATE IS CERTIFIED TO
          </p>
          <p className="mt-[3%] font-serif text-[5vw] text-[#8a6519]">
            {certificate.studentName}
          </p>
          <p className="mx-auto mt-[3%] max-w-[72%] text-[1.9vw] leading-snug">
            Has successfully completed the course{" "}
            <strong>{certificate.courseName}</strong> provided by
          </p>
          <p className="mt-[1%] text-[2vw]">
            APOLLO GLOBAL ACADEMY PTE LTD
          </p>
        </div>

        <div className="absolute bottom-[8%] left-[6%] grid h-[18%] w-[18%] place-items-center rounded-full bg-red-600 text-center text-white shadow-xl">
          <div className="grid h-[82%] w-[82%] place-items-center rounded-full border-2 border-red-800">
            <div>
              <p className="text-[2.4vw] font-black">AGA</p>
              <p className="text-[0.8vw] font-bold uppercase tracking-[0.16em]">
                Seal
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[9%] left-[31%] w-[28%] text-center">
          <div className="mx-auto mb-1 h-10 w-40 border-b-2 border-black font-serif text-[2.4vw] italic">
            Alan
          </div>
          <div className="border-t border-black pt-2">
            <p className="text-[1.8vw]">{certificate.signatoryTitle}</p>
            <p className="text-[1.8vw] font-black">{certificate.signatoryName}</p>
          </div>
        </div>

        <div className="absolute bottom-[12%] right-[10%] w-[28%] text-center">
          <p className="mb-4 text-[1.9vw]">{formatDate(certificate.issueDate)}</p>
          <div className="border-t border-black pt-2 text-[1.8vw]">Date</div>
        </div>
      </div>
    </div>
  );
}
