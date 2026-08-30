import { forwardRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { journeyAssets } from "./journeyAssets";
import "./walking-student.css";

export type WalkingStudentState = "idle" | "walking" | "walkingLeft" | "thinking" | "facingRight" | "facingLeft";
interface Props { state?: WalkingStudentState; className?: string; style?: CSSProperties }

export const WalkingStudent = forwardRef<HTMLSpanElement, Props>(({ state = "idle", className, style }, ref) => (
  <span ref={ref} className={cn("walking-student", className)} data-state={state} style={style} aria-hidden="true">
    <span className="walking-student__walk">
      {journeyAssets.character.walking.map((frame, index) => <img key={frame.src} src={frame.src} alt="" draggable={false} style={{ "--frame": index } as CSSProperties} />)}
    </span>
    <img className="walking-student__pose walking-student__idle" src={journeyAssets.character.idle.src} alt="" draggable={false} />
    <img className="walking-student__pose walking-student__thinking" src={journeyAssets.character.thinking.src} alt="" draggable={false} />
    <img className="walking-student__pose walking-student__left" src={journeyAssets.character.facingLeft.src} alt="" draggable={false} />
  </span>
));
WalkingStudent.displayName = "WalkingStudent";
export default WalkingStudent;
