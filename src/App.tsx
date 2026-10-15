import { AppShell } from './AppShell'
import { Contact } from './components/sections/contact/Contact'
import { Experience } from './components/sections/experience/Experience'
import { Hero } from './components/sections/hero/Hero'
import { Process } from './components/sections/process/Process'
import { Services } from './components/sections/services/Services'
import { TechStack } from './components/sections/stack/TechStack'
import { SelectedWork } from './components/sections/work/SelectedWork'
import { SectionDivider } from './components/ui/SectionDivider'

export default function App() {
  return (
    <AppShell page="home">
      <Hero />
      <SectionDivider from="00" to="01" />
      <Services />
      <SectionDivider from="01" to="02" />
      <Experience />
      <SectionDivider from="02" to="03" />
      <SelectedWork />
      <SectionDivider from="03" to="04" />
      <Process />
      <SectionDivider from="04" to="05" />
      <TechStack />
      <SectionDivider from="05" to="06" />
      <Contact />
    </AppShell>
  )
}
