"use client";

import { ClassSpecific } from "@/lib/generated/graphql";

export interface BaseResourceFormProps {
  register: any;
  setValue: any;
  watch: any;
  classData?: any;
  level: number;
}

export interface LevelData {
  level: number;
  class_specific?: ClassSpecific;
}
