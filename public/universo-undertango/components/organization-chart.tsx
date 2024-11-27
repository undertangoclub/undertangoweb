"use client";

import Image from "next/image";
import { HexagonFrame } from "./hexagon-frame";
import { SectionTitle } from "./section-title";

export default function OrganizationChart() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Management Section */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-cyan-400 mb-4">
              Gerencia orientada al cliente (B2C)
            </h3>
            <div className="flex justify-center gap-4">
              <HexagonFrame>
                <Image
                  src="/placeholder.svg"
                  alt="Director 1"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </HexagonFrame>
            </div>
          </div>
          <div>
            <h3 className="text-cyan-400 mb-4">
              Gerencia orientada a inversores (B2B)
            </h3>
            <div className="flex justify-center gap-4">
              <HexagonFrame>
                <Image
                  src="/placeholder.svg"
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
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column - Artistic Team */}
          <div className="space-y-8">
            <div>
              <SectionTitle title="Equipo Bailarines" />
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3].map((i) => (
                  <HexagonFrame key={`dancer-${i}`}>
                    <Image
                      src="/placeholder.svg"
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
              <div className="flex flex-wrap gap-4">
                {[1, 2].map((i) => (
                  <HexagonFrame key={`musician-${i}`}>
                    <Image
                      src="/placeholder.svg"
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
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3].map((i) => (
                  <HexagonFrame key={`tech-${i}`}>
                    <Image
                      src="/placeholder.svg"
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
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <HexagonFrame key={`investor-${i}`}>
                    <Image
                      src="/placeholder.svg"
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
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3].map((i) => (
                  <HexagonFrame key={`client-${i}`}>
                    <Image
                      src="/placeholder.svg"
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
              <div className="flex flex-wrap gap-4">
                {[1, 2].map((i) => (
                  <HexagonFrame key={`eco-${i}`}>
                    <Image
                      src="/placeholder.svg"
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
            src="/placeholder.svg"
            alt="UnderTango Club Logo"
            width={256}
            height={256}
            className="object-contain"
          />
        </div>

        {/* Footer Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <SectionTitle title="Medios de comunicación" />
              <div className="flex gap-4">
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
                      {/* Icon placeholder */}
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <SectionTitle title="Países" />
              <div className="flex gap-4">
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
    </div>
  );
}
