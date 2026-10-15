import { about, services } from '../../../content/site'
import { Reveal } from '../../ui/Reveal'
import { SectionHeading } from '../../ui/SectionHeading'
import { SpecCard } from './SpecCard'

export function Services() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 md:py-36">
      <div className="container-site">
        <SectionHeading index="01" label="Services" title={about.heading} id="about-title">
          {about.intro}
        </SectionHeading>

        <ul className="mt-16 grid gap-4 md:mt-20 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal as="li" key={service.code} delay={i * 0.1} className="h-full">
              <SpecCard service={service} index={i} total={services.length} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
