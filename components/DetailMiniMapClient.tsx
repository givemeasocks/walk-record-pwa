"use client";

import dynamic from "next/dynamic";

const DetailMiniMap = dynamic(() => import("./DetailMiniMap"), { ssr: false });

export default DetailMiniMap;
