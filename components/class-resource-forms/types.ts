"use client";

import { ClassSpecific } from "@/lib/generated/graphql";
import type { Control } from "react-hook-form";

export interface BaseResourceFormProps {
  control: Control<any>;
  setValue: any;
  classData?: any;
  level: number;
}

export interface LevelData {
  level: number;
  class_specific?: ClassSpecific;
}
