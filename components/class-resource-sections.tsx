"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PointPool } from "@/lib/interfaces/interfaces";
import { Dispatch, SetStateAction } from "react";

interface PointPoolResourceProps {
  name: string;
  value: number;
  maxValue: number;
  onChange: (value: number) => void;
  onChangeMax: (value: number) => void;
  icon?: React.ReactNode;
  colorClass?: string;
}

export function PointPoolResource({
  name,
  value,
  maxValue,
  onChange,
  onChangeMax,
  icon,
  colorClass = "text-arcane-400",
}: PointPoolResourceProps) {
  return (
    <div className="flex items-center gap-4">
      {icon && <div className={colorClass}>{icon}</div>}
      <div className="flex-1">
        <Label className="text-text-secondary text-sm">{name}</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            type="number"
            min="0"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-20 bg-bg-inset border-border-default h-9"
          />
          <span className="text-text-secondary">/</span>
          <Input
            type="number"
            min="1"
            value={maxValue}
            onChange={(e) => {
              onChangeMax(parseInt(e.target.value));
            }}
            className="w-20 bg-bg-inset border-border-default h-9"
          />
        </div>
      </div>
    </div>
  );
}

interface SorceryPointsSectionProps {
  sorceryPoints: PointPool;
  setSorceryPoints: Dispatch<SetStateAction<PointPool>>;
  onChange: (value: PointPool) => void;
}

export function SorceryPointsSection({
  sorceryPoints,
  onChange,
  setSorceryPoints,
}: SorceryPointsSectionProps) {
  return (
    <PointPoolResource
      name="Sorcery Points"
      value={sorceryPoints?.current || 0}
      maxValue={sorceryPoints?.max || 0}
      onChange={(v) => {
        onChange({ current: v, max: sorceryPoints.max });
        setSorceryPoints({ current: v, max: sorceryPoints.max });
      }}
      onChangeMax={(m) => {
        onChange({ current: sorceryPoints.current, max: m });
        setSorceryPoints({ current: sorceryPoints.current, max: m });
      }}
      icon={
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      }
      colorClass="text-arcane-400"
    />
  );
}

interface KiPointsSectionProps {
  kiPoints?: { kiPoints?: number; kiPoints_max?: number };
  onChange: (value: { kiPoints: number; kiPoints_max: number }) => void;
  setKiPoints: Dispatch<SetStateAction<{ kiPoints: number; kiPoints_max: number }>>;
}

export function KiPointsSection({ kiPoints, onChange, setKiPoints }: KiPointsSectionProps) {
  const value = kiPoints?.kiPoints ?? 0;
  const maxValue = kiPoints?.kiPoints_max ?? value;

  return (
    <PointPoolResource
      name="Ki"
      value={value}
      maxValue={maxValue}
      onChange={(v) => {
        onChange({ kiPoints: v, kiPoints_max: maxValue });
        setKiPoints({ kiPoints: v, kiPoints_max: maxValue });
      }}
      onChangeMax={(m) => {
        onChange({ kiPoints: value, kiPoints_max: m });
        setKiPoints({ kiPoints: value, kiPoints_max: m });
      }}
      icon={
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      }
      colorClass="text-nature-400"
    />
  );
}

interface RageSectionProps {
  rages?: { rages?: number; rages_max?: number };
  onChange: (value: { rages: number; rages_max: number }) => void;
  setRages: Dispatch<SetStateAction<{ rages: number; rages_max: number }>>;
}

export function RageSection({ rages, onChange, setRages }: RageSectionProps) {
  const value = rages?.rages ?? 0;
  const maxValue = rages?.rages_max ?? value;

  return (
    <PointPoolResource
      name="Fúrias"
      value={value}
      maxValue={maxValue}
      onChange={(v) => {
        onChange({ rages: v, rages_max: maxValue });
        setRages({ rages: v, rages_max: maxValue });
      }}
      onChangeMax={(m) => {
        onChange({ rages: value, rages_max: m });
        setRages({ rages: value, rages_max: m });
      }}
      icon={
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
          />
        </svg>
      }
      colorClass="text-martial-400"
    />
  );
}

interface InspirationSectionProps {
  inspiration?: { inspiration?: number; inspiration_max?: number };
  onChange: (value: { inspiration: number; inspiration_max: number }) => void;
  setInspiration: Dispatch<SetStateAction<{ inspiration: number; inspiration_max: number }>>;
}

export function InspirationSection({
  inspiration,
  onChange,
  setInspiration,
}: InspirationSectionProps) {
  const value = inspiration?.inspiration ?? 0;
  const maxValue = inspiration?.inspiration_max ?? (value > 0 ? value : 1);

  return (
    <PointPoolResource
      name="Inspiração Bárdica"
      value={value}
      maxValue={maxValue}
      onChange={(v) => {
        onChange({ inspiration: v, inspiration_max: maxValue });
        setInspiration({ inspiration: v, inspiration_max: maxValue });
      }}
      onChangeMax={(m) => {
        onChange({ inspiration: value, inspiration_max: m });
        setInspiration({ inspiration: value, inspiration_max: m });
      }}
      icon={
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      }
      colorClass="text-arcane-400"
    />
  );
}

interface ChannelDivinitySectionProps {
  channelDivinityCharges?: {
    channelDivinityCharges?: number;
    channelDivinityCharges_max?: number;
  };
  onChange: (value: {
    channelDivinityCharges: number;
    channelDivinityCharges_max: number;
  }) => void;
  setChannelDivinityCharges: Dispatch<
    SetStateAction<{
      channelDivinityCharges: number;
      channelDivinityCharges_max: number;
    }>
  >;
}

export function ChannelDivinitySection({
  channelDivinityCharges,
  onChange,
  setChannelDivinityCharges,
}: ChannelDivinitySectionProps) {
  const value = channelDivinityCharges?.channelDivinityCharges ?? 0;
  const maxValue = channelDivinityCharges?.channelDivinityCharges_max ?? value;

  return (
    <PointPoolResource
      name="Canalizar Divindade"
      value={value}
      maxValue={maxValue}
      onChange={(v) => {
        onChange({
          channelDivinityCharges: v,
          channelDivinityCharges_max: maxValue,
        });
        setChannelDivinityCharges({
          channelDivinityCharges: v,
          channelDivinityCharges_max: maxValue,
        });
      }}
      onChangeMax={(m) => {
        onChange({
          channelDivinityCharges: value,
          channelDivinityCharges_max: m,
        });
        setChannelDivinityCharges({
          channelDivinityCharges: value,
          channelDivinityCharges_max: m,
        });
      }}
      icon={
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
          />
        </svg>
      }
      colorClass="text-nature-400"
    />
  );
}
