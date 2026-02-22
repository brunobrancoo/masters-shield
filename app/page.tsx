"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Shield, Swords, Users, Scroll, Flame, Zap, Heart, Skull } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-primary animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative">
      {/* Background layers */}
      <div className="fixed inset-0 bg-bg-primary texture-leather" />
      <div className="fixed inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary" />

      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-arcane-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-arcane-500/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Animated orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-arcane-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-divine-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="container mx-auto px-4 py-20 text-center">
            {/* Main title */}
            <div className="mb-8">
              <h1 className="font-heading text-6xl md:text-8xl font-bold text-text-primary mb-4 animate-roll-in">
                Escudo do Mestre
              </h1>
              <div className="inline-block">
                <h2 className="font-heading text-2xl md:text-4xl text-text-secondary tracking-widest uppercase">
                  Digital
                </h2>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-text-tertiary max-w-3xl mx-auto mb-12 font-light leading-relaxed">
              Domine suas campanhas de RPG com uma ferramenta medieval imersiva.
              Gerencie combates, monstros, jogadores e NPCs com elegância.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link
                  href="/campaign/select"
                  className="group relative px-8 py-4 bg-gradient-to-r from-arcane-600 to-arcane-500 rounded-lg text-text-primary font-semibold text-lg
                    shadow-[0_0_20px_hsl(var(--arcane-glow)/0.3)] hover:shadow-[0_0_30px_hsl(var(--arcane-glow)/0.5)]
                    transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Swords className="w-5 h-5" />
                    Ir para Campanhas
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-arcane-500 to-arcane-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="group relative px-8 py-4 bg-gradient-to-r from-arcane-600 to-arcane-500 rounded-lg text-text-primary font-semibold text-lg
                    shadow-[0_0_20px_hsl(var(--arcane-glow)/0.3)] hover:shadow-[0_0_30px_hsl(var(--arcane-glow)/0.5)]
                    transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Entrar no Reino
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-arcane-500 to-arcane-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              )}

              <Link
                href="#features"
                className="px-8 py-4 border border-arcane-500/30 rounded-lg text-arcane-400 font-semibold text-lg
                  hover:bg-arcane-500/10 transition-all duration-300"
              >
                Descubra Mais
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-text-tertiary/50 rounded-full flex items-start justify-center p-2">
                <div className="w-1.5 h-3 bg-arcane-500/50 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Section header */}
            <div className="text-center mb-20">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-4">
                Ferramentas do Mestre
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Tudo o que você precisa para criar experiências épicas na sua mesa de RPG
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-arcane-500 to-divine-500 mx-auto mt-6 rounded-full glow-arcane" />
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Combat Tracking */}
              <div className="group relative bg-bg-surface/80 backdrop-blur-sm border border-border-default rounded-lg p-8
                hover:border-arcane-500/50 transition-all duration-500 hover:transform hover:scale-105 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-arcane-500/5 rounded-full blur-2xl group-hover:bg-arcane-500/10 transition-all" />
                <div className="relative">
                  <div className="w-16 h-16 bg-arcane-500/10 rounded-lg flex items-center justify-center mb-6 glow-arcane">
                    <Swords className="w-8 h-8 text-arcane-400" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">
                    Sistema de Combate
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Rastreie iniciativa, turnos, e vida em tempo real. Gerencie múltiplos monstros e NPCs
                    com sincronização automática via Firebase.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-text-tertiary">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-arcane-500 rounded-full" />
                      Iniciativa automatizada
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-arcane-500 rounded-full" />
                      Vida temporária e buffs
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-arcane-500 rounded-full" />
                      Visual fullscreen em combate
                    </li>
                  </ul>
                </div>
              </div>

              {/* D&D Data */}
              <div className="group relative bg-bg-surface/80 backdrop-blur-sm border border-border-default rounded-lg p-8
                hover:border-divine-500/50 transition-all duration-500 hover:transform hover:scale-105 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-divine-500/5 rounded-full blur-2xl group-hover:bg-divine-500/10 transition-all" />
                <div className="relative">
                  <div className="w-16 h-16 bg-divine-500/10 rounded-lg flex items-center justify-center mb-6 glow-divine">
                    <Scroll className="w-8 h-8 text-divine-400" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">
                    Dados D&D 5e
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Acesso completo ao Livro dos Monstros com todos os NPCs e criaturas.
                    Carregue e personalize monstros instantaneamente.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-text-tertiary">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-divine-500 rounded-full" />
                      Monstros e NPCs do 5e
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-divine-500 rounded-full" />
                      Estatísticas completas
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-divine-500 rounded-full" />
                      Busca e filtragem rápida
                    </li>
                  </ul>
                </div>
              </div>

              {/* Character Creation */}
              <div className="group relative bg-bg-surface/80 backdrop-blur-sm border border-border-default rounded-lg p-8
                hover:border-nature-500/50 transition-all duration-500 hover:transform hover:scale-105 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-nature-500/5 rounded-full blur-2xl group-hover:bg-nature-500/10 transition-all" />
                <div className="relative">
                  <div className="w-16 h-16 bg-nature-500/10 rounded-lg flex items-center justify-center mb-6 glow-nature">
                    <Users className="w-8 h-8 text-nature-400" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">
                    Gestão de Personagens
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Crie e gerencie personagens jogáveis com classes, magias e recursos.
                    Suporte para todas as classes e especializações.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-text-tertiary">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-nature-500 rounded-full" />
                      Todas as classes 5e
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-nature-500 rounded-full" />
                      Sistema de magias completo
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-nature-500 rounded-full" />
                      Recursos de classe
                    </li>
                  </ul>
                </div>
              </div>

              {/* Damage Types */}
              <div className="group relative bg-bg-surface/80 backdrop-blur-sm border border-border-default rounded-lg p-8
                hover:border-damage/50 transition-all duration-500 hover:transform hover:scale-105 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-damage/5 rounded-full blur-2xl group-hover:bg-damage/10 transition-all" />
                <div className="relative">
                  <div className="w-16 h-16 bg-damage/10 rounded-lg flex items-center justify-center mb-6">
                    <Flame className="w-8 h-8 text-damage" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">
                    Tipos de Dano
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Suporte para todos os 13 tipos de dano do D&D 5e. Cada tipo tem sua cor e efeito visual
                    dedicado para fácil identificação.
                  </p>
                  <div className="mt-4 grid grid-cols-7 gap-2">
                    <div className="w-6 h-6 rounded bg-dmg-fire/80 border border-dmg-fire/30" title="Fire" />
                    <div className="w-6 h-6 rounded bg-dmg-cold/80 border border-dmg-cold/30" title="Cold" />
                    <div className="w-6 h-6 rounded bg-dmg-lightning/80 border border-dmg-lightning/30" title="Lightning" />
                    <div className="w-6 h-6 rounded bg-dmg-thunder/80 border border-dmg-thunder/30" title="Thunder" />
                    <div className="w-6 h-6 rounded bg-dmg-acid/80 border border-dmg-acid/30" title="Acid" />
                    <div className="w-6 h-6 rounded bg-dmg-poison/80 border border-dmg-poison/30" title="Poison" />
                    <div className="w-6 h-6 rounded bg-dmg-necrotic/80 border border-dmg-necrotic/30" title="Necrotic" />
                    <div className="w-6 h-6 rounded bg-dmg-radiant/80 border border-dmg-radiant/30" title="Radiant" />
                    <div className="w-6 h-6 rounded bg-dmg-psychic/80 border border-dmg-psychic/30" title="Psychic" />
                    <div className="w-6 h-6 rounded bg-dmg-force/80 border border-dmg-force/30" title="Force" />
                    <div className="w-6 h-6 rounded bg-dmg-bludgeoning/80 border border-dmg-bludgeoning/30" title="Bludgeoning" />
                    <div className="w-6 h-6 rounded bg-dmg-piercing/80 border border-dmg-piercing/30" title="Piercing" />
                    <div className="w-6 h-6 rounded bg-dmg-slashing/80 border border-dmg-slashing/30" title="Slashing" />
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <div className="group relative bg-bg-surface/80 backdrop-blur-sm border border-border-default rounded-lg p-8
                hover:border-debuff/50 transition-all duration-500 hover:transform hover:scale-105 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-debuff/5 rounded-full blur-2xl group-hover:bg-debuff/10 transition-all" />
                <div className="relative">
                  <div className="w-16 h-16 bg-debuff/10 rounded-lg flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 text-debuff" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">
                    Condições
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Gerencie todas as condições do jogo como cegueira, paralisia, encantamento e mais.
                    Visualização clara e intuitiva.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Blinded', 'Charmed', 'Frightened', 'Paralyzed', 'Poisoned', 'Stunned', 'Exhaustion'].map((condition) => (
                      <span
                        key={condition}
                        className="px-2 py-1 text-xs font-medium rounded border border-border-subtle bg-bg-inset text-text-tertiary"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rarity System */}
              <div className="group relative bg-bg-surface/80 backdrop-blur-sm border border-border-default rounded-lg p-8
                hover:border-rarity-legendary/50 transition-all duration-500 hover:transform hover:scale-105 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rarity-legendary/5 rounded-full blur-2xl group-hover:bg-rarity-legendary/10 transition-all" />
                <div className="relative">
                  <div className="w-16 h-16 bg-rarity-legendary/10 rounded-lg flex items-center justify-center mb-6">
                    <Skull className="w-8 h-8 text-rarity-legendary" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">
                    Sistema de Raridade
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Itens e equipamentos com sistema de raridade visual. De Comum a Artefato lendário,
                    com cores e efeitos distintos.
                  </p>
                  <div className="mt-4 space-y-2">
                    {[
                      { name: 'Comum', color: 'rarity-common' },
                      { name: 'Incomum', color: 'rarity-uncommon' },
                      { name: 'Raro', color: 'rarity-rare' },
                      { name: 'Muito Raro', color: 'rarity-very-rare' },
                      { name: 'Lendário', color: 'rarity-legendary' },
                      { name: 'Artefato', color: 'rarity-artifact' },
                    ].map((rarity) => (
                      <div key={rarity.name} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-${rarity.color}`} />
                        <span className="text-sm text-text-tertiary">{rarity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-arcane-500/5 via-bg-primary to-divine-500/5" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-6">
                Pronto para sua Aventura?
              </h2>
              <p className="text-xl text-text-secondary mb-12 leading-relaxed">
                Junte-se a milhares de mestres que estão transformando suas sessões de RPG com o
                Escudo do Mestre Digital. Crie sua conta gratuita e comece a construir histórias épicas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {user ? (
                  <Link
                    href="/campaign/select"
                    className="group relative px-10 py-5 bg-gradient-to-r from-arcane-600 to-arcane-500 rounded-lg text-text-primary font-semibold text-xl
                      shadow-[0_0_25px_hsl(var(--arcane-glow)/0.4)] hover:shadow-[0_0_40px_hsl(var(--arcane-glow)/0.6)]
                      transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Swords className="w-6 h-6" />
                      Iniciar Campanha
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-arcane-500 to-arcane-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="group relative px-10 py-5 bg-gradient-to-r from-arcane-600 to-arcane-500 rounded-lg text-text-primary font-semibold text-xl
                      shadow-[0_0_25px_hsl(var(--arcane-glow)/0.4)] hover:shadow-[0_0_40px_hsl(var(--arcane-glow)/0.6)]
                      transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Heart className="w-6 h-6" />
                      Começar Gratuitamente
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-arcane-500 to-arcane-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )}

                <Link
                  href="#features"
                  className="px-10 py-5 border border-arcane-500/30 rounded-lg text-arcane-400 font-semibold text-xl
                    hover:bg-arcane-500/10 transition-all duration-300"
                >
                  Explorar Recursos
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-16 pt-16 border-t border-border-subtle">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <div className="text-3xl font-bold text-text-primary mb-2">100%</div>
                    <div className="text-sm text-text-tertiary">Gratuito</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-text-primary mb-2">5e</div>
                    <div className="text-sm text-text-tertiary">D&D Oficial</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-text-primary mb-2">∞</div>
                    <div className="text-sm text-text-tertiary">Campanhas</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-text-primary mb-2">24/7</div>
                    <div className="text-sm text-text-tertiary">Disponível</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-12 border-t border-border-subtle">
          <div className="container mx-auto px-4 text-center">
            <p className="text-text-tertiary text-sm">
              © 2024 Escudo do Mestre Digital. Todos os direitos reservados.
            </p>
            <p className="text-text-tertiary text-xs mt-2">
              Não afiliado à Wizards of the Coast. D&D é uma marca registrada da Wizards of the Coast.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
