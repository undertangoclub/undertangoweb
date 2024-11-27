"use client";
import Image from "next/image";
import HexagonFrame from "./HexagonFrame";
import SectionTitle from "./SectionTitle";
import { useEffect } from "react";

export default function OrganizationChart() {
  useEffect(() => {
    // Any client-side only code goes here
  }, []);
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Management Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="text-cyan-400 mb-4 text-center">
            Gerencia orientada al cliente (B2C)
          </h3>
          <div className="flex justify-center gap-4">
            <HexagonFrame>
              <Image
                src="/img/director1.jpg"
                alt="Director 1"
                width={80}
                height={80}
                className="object-cover"
              />
            </HexagonFrame>
          </div>
        </div>
        <div>
          <h3 className="text-cyan-400 mb-4 text-center">
            Gerencia orientada a inversores (B2B)
          </h3>
          <div className="flex justify-center gap-4">
            <HexagonFrame>
              <Image
                src="/img/director2.jpg"
                alt="Director 2"
                width={80}
                height={80}
                className="object-cover"
              />
            </HexagonFrame>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column - Artistic Team */}
        <div className="space-y-8">
          <div>
            <SectionTitle title="Equipo Bailarines" />
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <HexagonFrame key={`dancer-${i}`}>
                  <Image
                    src={`/img/dancer${i}.jpg`}
                    alt={`Bailarin ${i}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </HexagonFrame>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title="Músicos" />
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2].map((i) => (
                <HexagonFrame key={`musician-${i}`}>
                  <Image
                    src={`/img/musician${i}.jpg`}
                    alt={`Músico ${i}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </HexagonFrame>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title="Técnicos" />
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <HexagonFrame key={`tech-${i}`}>
                  <Image
                    src={`/img/tech${i}.jpg`}
                    alt={`Técnico ${i}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </HexagonFrame>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Business */}
        <div className="space-y-8">
          <div>
            <SectionTitle title="Inversionistas" />
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <HexagonFrame key={`investor-${i}`}>
                  <Image
                    src={`/img/investor${i}.jpg`}
                    alt={`Inversionista ${i}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </HexagonFrame>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title="Clientes" />
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <HexagonFrame key={`client-${i}`}>
                  <Image
                    src={`/img/client${i}.jpg`}
                    alt={`Cliente ${i}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </HexagonFrame>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title="Grupos ecológicos" />
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2].map((i) => (
                <HexagonFrame key={`eco-${i}`}>
                  <Image
                    src={`/img/eco${i}.jpg`}
                    alt={`Grupo ${i}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </HexagonFrame>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center Logo */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-64">
        <Image
          src="/img/undertango-logo.png"
          alt="UnderTango Club Logo"
          width={256}
          height={256}
          className="object-contain"
        />
      </div>

      {/* Footer Section */}
      <div className="mt-16 pt-8 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <SectionTitle title="Medios de comunicación" />
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "facebook",
                "instagram",
                "twitter",
                "youtube",
                "whatsapp",
                "spotify",
              ].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <Image
                      src={`/img/${social}-icon.png`}
                      alt={`${social} icon`}
                      width={24}
                      height={24}
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div>
            <SectionTitle title="Países" />
            <div className="flex flex-wrap justify-center gap-4">
              {["AR", "BR", "PY", "US", "CN", "DE"].map((country) => (
                <span
                  key={country}
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
