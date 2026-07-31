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
      <div className="mx-auto w-[980px] max-w-full">
        <div className="relative aspect-[842/595] overflow-hidden bg-white text-black">
          <div className="absolute inset-[12px] border-[3px] border-[#b9851f]" />

          <div className="absolute -left-[70px] top-[62px] h-[3px] w-[470px] -rotate-[11deg] bg-[#d1a03a]" />
          <div className="absolute -left-[38px] top-[134px] h-[3px] w-[330px] -rotate-45 bg-[#f3d76a]" />
          <div className="absolute -right-[70px] bottom-[74px] h-[3px] w-[480px] -rotate-[11deg] bg-[#d1a03a]" />
          <div className="absolute -right-[35px] bottom-[132px] h-[3px] w-[340px] -rotate-45 bg-[#f3d76a]" />

          <p className="absolute right-[92px] top-[58px] text-[18px] font-black">
            Reference no. {certificate.referenceNumber}
          </p>

          <img
            src="/AGA-Admin/aga-logo-horizontal.png"
            alt="Apollo Global Academy"
            className="absolute left-1/2 top-[70px] h-[72px] w-[220px] -translate-x-1/2 object-contain"
          />

          <div className="absolute inset-x-0 top-[174px] text-center">
            <p className="text-[30px] font-black tracking-[0.04em]">
              APOLLO DRONES ACADEMY <sup className="text-[16px]">TM</sup>
            </p>

            <h3 className="mt-[46px] font-serif text-[48px] tracking-[0.13em]">
              CERTIFICATE OF COMPLETION
            </h3>

            <p className="mt-[48px] text-[22px] font-black tracking-[0.28em]">
              THIS CERTIFICATE IS CERTIFIED TO
            </p>

            <p className="mt-[24px] font-serif text-[50px] text-[#8a6519]">
              {certificate.studentName}
            </p>

            <p className="mx-auto mt-[34px] max-w-[760px] text-[20px] leading-snug">
              Has successfully completed the course{" "}
              <strong>{certificate.courseName}</strong> provided by
            </p>
            <p className="mt-[6px] text-[22px]">
              APOLLO GLOBAL ACADEMY PTE LTD
            </p>
          </div>

          <div className="absolute bottom-[42px] left-[42px] grid h-[134px] w-[134px] place-items-center rounded-full bg-red-600 text-center text-white shadow-xl">
            <div className="grid h-[108px] w-[108px] place-items-center rounded-full border-2 border-red-900">
              <div>
                <p className="text-[28px] font-black leading-none">AGA</p>
                <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em]">
                  Apollo Global Academy
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[60px] left-[275px] w-[260px] text-center">
            <div className="mx-auto h-[54px] w-[170px] font-serif text-[34px] italic leading-[54px]">
              Alan
            </div>
            <div className="border-t border-black pt-[10px]">
              <p className="text-[18px]">{certificate.signatoryTitle}</p>
              <p className="text-[18px] font-black">{certificate.signatoryName}</p>
            </div>
          </div>

          <div className="absolute bottom-[60px] right-[110px] w-[280px] text-center">
            <p className="h-[54px] text-[20px] leading-[54px]">
              {formatDate(certificate.issueDate)}
            </p>
            <div className="border-t border-black pt-[10px] text-[18px]">
              Date
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
