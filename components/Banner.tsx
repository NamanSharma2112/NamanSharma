import Image from "next/image";

export default function Banner() {
  return (
    <div className="max-w-[620px] mx-auto px-6">
      <div className="relative w-full h-[140px] sm:h-[180px] rounded-xl overflow-hidden">
        {/* Banner image */}
        <Image
          src="/banner.jpg"
          alt="Banner"
          fill
          priority
          className="object-cover object-center"
        />
        {/* White gradient fade at the bottom */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0.95) 100%)",
          }}
        />
      </div>
    </div>
  );
}
