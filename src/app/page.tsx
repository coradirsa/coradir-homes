import Home from "./components/home/home";
import SectionCreateHomes from "./components/home/components/sectionCreateHomes"; 
import SectionProjectsDone from "./components/home/components/sectionProjectsDone";
export default function Page() {
  return ( 
    <> 
      <Home/>
      <SectionCreateHomes/>
      <SectionProjectsDone/>
    </>
  );
}
