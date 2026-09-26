import StudyApp from "@/components/StudyApp";
import { StudyProvider } from "@/lib/study-context";

export default function Home() {
  return (
    <StudyProvider>
      <StudyApp />
    </StudyProvider>
  );
}
