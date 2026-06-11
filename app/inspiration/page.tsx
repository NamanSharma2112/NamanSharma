import Image from "next/image";

const INSPIRATIONS = [
  {
    name: "Rauno",
    desc: "God level design engineer",
    url: "https://rauno.me/",
    icon: "https://www.google.com/s2/favicons?domain=rauno.me&sz=256",
  },
  {
    name: "Emil Kowalski",
    desc: "Incredible design engineer and creator of Animations.dev",
    url: "https://emilkowal.ski/",
    icon: "https://www.google.com/s2/favicons?domain=emilkowal.ski&sz=256",
  },
  {
    name: "Animations.dev",
    desc: "The best place to learn Framer Motion",
    url: "https://animations.dev/",
    icon: "https://www.google.com/s2/favicons?domain=animations.dev&sz=256",
  },
  {
    name: "Yui540",
    desc: "Creative frontend developer with amazing interactive works",
    url: "https://yui540.com/",
    icon: "https://www.google.com/s2/favicons?domain=yui540.com&sz=256",
  },
  {
    name: "Manu Arora",
    desc: "Creator of Aceternity UI and amazing developer",
    url: "https://manuarora.in/",
    icon: "https://www.google.com/s2/favicons?domain=manuarora.in&sz=256",
  },
  {
    name: "Josh W Comeau",
    desc: "Phenomenal educator and CSS wizard",
    url: "https://www.joshwcomeau.com/",
    icon: "https://www.google.com/s2/favicons?domain=joshwcomeau.com&sz=256",
  },
];

export default function InspirationPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-32">
      <div className="max-w-[650px] mx-auto px-6">
        
        {/* Header Text */}
        <div className="mb-14 text-[15px] leading-[1.6] text-zinc-600 flex flex-col gap-5">
          <p>
            A list of all the people that I look up to, websites that I admire, tools that I use and everything else that follows.
          </p>
          <p>
            I will keep on updating this list as I find more inspiration.
          </p>
        </div>

        {/* Inspiration List */}
        <ul className="flex flex-col gap-6">
          {INSPIRATIONS.map((item, i) => (
            <li key={i} className="flex items-center gap-4 group">
              {/* Avatar Icon */}
              <div className="relative w-10 h-10 shrink-0 rounded-full border border-zinc-200/80 bg-white overflow-hidden shadow-sm flex items-center justify-center">
                <img 
                  src={item.icon} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                />
              </div>

              {/* Text Content */}
              <div className="flex items-baseline gap-2">
                <span className="text-[15px] font-medium text-zinc-800 tracking-tight">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-black transition-colors">
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                </span>
                <span className="text-zinc-300 text-[10px]">
                  •
                </span>
                <span className="text-[15px] text-zinc-500">
                  {item.desc}
                </span>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
