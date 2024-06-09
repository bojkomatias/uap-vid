'use client'
import { useProtocolContext } from 'utils/createContext'
import { motion } from 'framer-motion'
import Select from '@protocol/elements/inputs/select'
import Input from '@protocol/elements/inputs/input'
import SectionTitle from '@protocol/elements/form-section-title'
import InfoTooltip from '@protocol/elements/tooltip'
import dynamic from 'next/dynamic'
const Textarea = dynamic(() => import('@protocol/elements/inputs/textarea'))

export function DescriptionForm() {
    const form = useProtocolContext()
    const path = 'sections.description.'

    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
        >
            <SectionTitle title="Descripción del proyecto" />

            <>
                <Select
                    path={path + 'discipline'}
                    label="disciplina general y área especifica"
                    options={disciplines}
                    conditionalCleanup={() =>
                        (form.values.sections.description.line = '')
                    }
                />
                <Select
                    path={path + 'line'}
                    label="línea de investigación"
                    options={
                        lines(form.values.sections.description.discipline) ?? []
                    }
                />
                <Textarea path={path + 'technical'} label="Resumen técnico" />
                <Input path={path + 'words'} label="palabras clave" />
                <FieldInfo />
                <Select
                    path={path + 'field'}
                    options={fields}
                    label="campo de aplicación"
                />
                <ObjectiveInfo />
                <Select
                    path={path + 'objective'}
                    label="objetivo socioeconómico"
                    options={objective}
                />
                <TypeInfo />
                <Select
                    path={path + 'type'}
                    label="tipo de investigación"
                    options={type}
                />
            </>
        </motion.div>
    )
}

const FieldInfo = () => (
    <InfoTooltip className="fixed bottom-4">
        <p>
            <b>Ciencias exactas y naturales:</b> astronomía; ciencias
            espaciales; bacteriología; biología; bioquímica; biofísica;
            botánica; toxicología; genética; física; geofísica; geografía
            física; geología; mineralogía; informática (solo desarrollo del
            software, el hardware deberá ser clasificado como ingeniería y
            tecnología); matemática; estadística; meteorología; química;
            entomología; zoología; antropología física; psicofisiología; otros
            campos conexos.
        </p>
        <p>
            <b>Ingeniería y tecnología:</b> ingeniería civil; ingeniería
            eléctrica; ingeniería electrónica; ingeniería mecánica; ingeniería
            química con sus diversas especializaciones; ingeniería en
            telecomunicaciones; productos forestales; ciencias aplicadas como la
            geodesia, la química industrial, etc.; ciencia y tecnología de la
            producción de alimentos y bebidas; tecnología textil, calzado y
            cueros; tecnologías especializadas o ramas interdisciplinarias, por
            ejemplo, análisis de sistemas; metalurgia, minería e industrias
            extractivas; arquitectura y urbanismo; cartografía; otros campos
            conexos.
        </p>
        <p>
            <b> Ciencias médicas:</b> anatomía; farmacia; fisioterapia;
            medicina; obstetricia; odontología; optometría; osteopatía; sanidad
            pública; higiene; técnicas de enfermería; otros campos conexos.
        </p>
        <p>
            <b>Ciencias agrícolas y veterinarias:</b>
            agronomía; horticultura; ganadería; pesca; silvicultura; productos
            forestales; veterinaria; zootecnia; otros campos conexos.
        </p>
        <p>
            <b> Ciencias sociales:</b> antropología (social y cultural) y
            etnología; demografía; economía; educación y formación; geografía
            (humana, económica y social); gestión lingüística (excluidos los
            estudios de lenguas efectuados sobre textos determinados, que
            deberían clasificarse en humanidades en la categoría de lenguas y
            literaturas antiguas y modernas); psicología; ciencias jurídicas;
            ciencias políticas; sociología; organización científica del trabajo;
            comercio y administración; ciencias sociales varias y actividades de
            CyT interdisciplinarias, metodológicas, históricas, etc., relativas
            a los campos de este grupo. La psicofisiología, la antropología y la
            geografía físicas deberán clasificarse entre las ciencias exactas y
            naturales.
        </p>
        <p>
            <b>Humanidades y artes:</b>
            artes (historia y crítica de las artes, excluidas las
            investigaciones artísticas de todo tipo); lenguas y literaturas
            antiguas y modernas; filosofía (incluida la historia de las ciencias
            y las técnicas); religión; prehistoria e historia, así como las
            ciencias auxiliares de la historia: arqueología, paleografía,
            numismática, etc.; otros campos y materias correspondientes a este
            grupo y actividades de CyT interdisciplinarias, metodológicas,
            históricas, etc., relativas a los campos de este grupo.
        </p>
    </InfoTooltip>
)
const ObjectiveInfo = () => (
    <InfoTooltip className="fixed bottom-4">
        <p>
            <b>Exploración y explotación de la tierra:</b> abarca la I+D cuyos
            objetivos estén relacionados con la exploración de la corteza y la
            cubierta terrestre, los mares, los océanos y la atmósfera, y la I+D
            sobre su explotación. También incluye la I+D climática y
            meteorológica, la exploración polar y la hidrológica. No incluye: la
            I+D sobre la mejora de suelos (OSE4), contaminación (OSE2) y pesca y
            uso de suelos (OSE8).
        </p>
        <p>
            <b>Medio ambiente:</b> comprende la I+D sobre el control de la
            contaminación, destinada a la identificación y análisis de sus
            fuentes de contaminación y causas, y todos los contaminantes,
            incluyendo su dispersión en el medio ambiente y los efectos sobre la
            humanidad, sobre las especies vivas (fauna, flora, microorganismos)
            y la biosfera. Incluye el desarrollo de instalaciones de control
            para la medición de todo tipo de contaminantes. Lo mismo es válido
            para la eliminación y prevención de todo tipo de contaminantes en
            todos los tipos de medio ambientes.
        </p>
        <p>
            <b>Exploración y explotación del espacio:</b> abarca toda la I+D
            civil en el espacio relacionada con la exploración del espacio,
            laboratorios espaciales, navegación espacial y sistemas de
            lanzamiento. La investigación análoga realizada en Defensa se
            clasifica en el OSE13. Aunque la I+D espacial civil no está en
            general orientada a un objetivo específico, con frecuencia sí tiene
            un fin determinado, como el aumento del conocimiento general (por
            ejemplo, la astronomía), o se refiere a aplicaciones particulares
            (por ejemplo, la observación de la Tierra y los satélites de
            telecomunicaciones). Sin embargo, esta categoría se mantiene para
            facilitar los informes de países con grandes programas espaciales.
        </p>
        <p>
            <b>Transporte, telecomunicación y otras infraestructuras:</b> abarca
            la I+D dirigida a infraestructura y desarrollo territorial,
            incluyendo la construcción de edificios. En general, este OSE
            engloba toda la I+D relativa a la planificación general del uso del
            suelo. Esto incluye la I+D destinada a la protección contra los
            efectos dañinos de la planificación urbana y rural, pero no la
            investigación de otros tipos de contaminación (OSE 2). Este OSE
            también incluye la I+D relativa a los sistemas de transporte;
            sistemas de telecomunicación; planificación general del uso del
            suelo; la construcción y planificación de edificios; ingeniería
            civil; y abastecimiento de agua.
        </p>
        <p>
            <b>Energía:</b> abarca la I+D destinada a la mejora de la
            producción, almacenamiento, transporte, distribución y uso racional
            de todas las formas de la energía. También incluye la I+D sobre los
            procesos diseñados para incrementar la eficacia de su producción y
            distribución, y el estudio de la conservación. No incluye la I+D
            relacionada con prospecciones (OSE1) y la I+D de la propulsión de
            vehículos y motores (OSE6).
        </p>
        <p>
            <b> Producción y tecnología industrial:</b>
            cubre la I+D destinada a la mejora de la producción y la tecnología
            industrial, incluyendo la I+D en productos industriales y sus
            procesos de fabricación, excepto en los casos en que forman una
            parte integrante de la búsqueda de otros objetivos (por ejemplo:
            defensa, espacio, energía, agricultura).
        </p>
    </InfoTooltip>
)
const TypeInfo = () => (
    <InfoTooltip className="fixed bottom-4">
        <p>
            <b> Investigación básica:</b> consiste en trabajos experimentales o
            teóricos que se emprenden con el objetivo de obtener nuevos
            conocimientos acerca de los fundamentos de fenómenos y hechos
            observables, sin pensar en darles ninguna aplicación o utilización
            determinada.
        </p>
        <p>
            <b>Investigación aplicada:</b>consiste en trabajos originales
            realizados para adquirir nuevos conocimientos; sin embargo, está
            dirigida fundamentalmente hacia un objetivo práctico específico.
        </p>
        <p>
            <b>Desarrollo experimental:</b> consiste en trabajos sistemáticos
            basados en conocimientos obtenidos de la investigación y la
            experiencia práctica y en la producción de conocimiento adicional,
            dirigidos a la producción de nuevos productos o procesos o a la
            mejora de productos y procesos existentes.
        </p>
    </InfoTooltip>
)

const disciplines = [
    'Ciencias Económicas y de la Administración',
    'Ciencias de la Salud',
    'Humanidades, Educación y Ciencias Sociales',
    'Teología',
]
const lines = (v: string) => {
    if (v === 'Ciencias Económicas y de la Administración')
        return [
            'Contabilidad y auditoría: Management y Estudios Organizacionales',
            'Contabilidad y auditoría: Ética y Compliance',
            'Contabilidad y auditoría: Liderazgo',
            'Economía',
            'Emprendimiento y ecosistemas emprendedores',
            'Dinero e inflación en argentina',
            'Robótica e impresión 3D',
            'Ingeniería en Sistemas',
            'Tecnología asistiva',
            'Informática industrial',
            'Educación y cultura financiera',
            'Formación y enseñanza en administración y contabilidades',
            'Efectos y utilización de tecnologias en Ciencias Económica',
        ]
    if (v === 'Ciencias de la Salud')
        return [
            'Promoción de la salud',
            'Restauración de la salud',
            'Educación en ciencias de la salud',
            'Bioética',
        ]
    if (v === 'Humanidades, Educación y Ciencias Sociales')
        return [
            'Psicometría y evaluación psicológica',
            'Neuropsicología',
            'Psicología educacional',
            'Psicología de la familia, Parentalidad',
            'Psicología del desarrollo',
            'Recursos protectores y psicología positiva',
            'Psicología de la salud',
            'Psicología de la religión y la espiritualidad',
            'Terminología, lexicografía y fraseología',
            'Tecnologías aplicadas a la traducción',
            'Teoría de la traducción y la interpretación',
            'Didáctica de la traducción y la interpretación',
            'Estudio cultural de la traducción y la interpretación',
            'Aspectos profesionales y laborales de la traducción y la interpretación',
            'La traducción especializada',
            'Estudios sobre interpretación',
            'Formación de docentes de lenguas extranjeras',
            'Lingüística aplicada a la adquisición del inglés como segunda lengua',
            'Metodología, enseñanza y evaluación de lenguas extranjeras',
            'Uso de las TIC en el aula de lengua extranjera',
            'Estudios de literatura en lengua inglesa',
            'Educación, reeducación y prevención en las actividades físicas',
            'Actividad física como prevención de enfermedades en adultos jóvenes',
            'Educación física en la prevención de adicciones',
            'Influencia de la actividad física en el rendimiento integral',
            'La actividad física y la autoestima',
            'Dirección de comunicación',
            'Producción de medios',
            'Comunicación integrada de marketing',
            'Nuevas tecnologías y entornos digitales',
            'Comunicación audiovisual',
            'Análisis de contenidos en medios',
            'La imagen como recurso de información y comunicación',
            'Sistematización de una filosofía bíblica: supuestos ontológicos, epistemológicos, antropológicos, teológicos y cosmológicos de las Escrituras',
            'Desarrollos actuales de la filosofía y su significado para la comprensión bíblica de la relación entre fe, razón, ciencia y religión',
            'Deconstrucción de los supuestos básicos de la filosofía clásica, moderna y contemporánea desde la filosofía bíblica',
            'La epistemología o filosofía de la ciencia contemporáneas y el descubrimiento de la razón hipotética e interpretativa',
            'Postmodernismo y fe cristiana',
            'Cosmovisión cristiana, ética, política, derecho y sociedad',
            'Humanismo, religiosidad y educación',
            'Estudio de los supuestos filosóficos de la ciencia moderna y su crítica desde los supuestos de la filosofía bíblica',
            'Explicitación de los supuestos ontológicos, epistemológicos y antropológicos de las corrientes de la psicología moderna y su evaluación desde la ontología, la epistemología y la antropología bíblicas',
            'Los nuevos desarrollos de la filosofía en el siglo XXI y su confrontación con la filosofía posmoderna y con la filosofía bíblica',
            'Postmodernidad, hipermodernidad y valores éticos bíblicos',
            "La ciencia del 'ajuste fino' del universo y la tendencia a resucitar científicamente la idea de una inteligencia ordenadora del universo",
        ]
    if (v === 'Teología')
        return [
            'Exégesis veterotestamentaria: Pentateuco',
            'Exégesis veterotestamentaria: Salterio',
            'Exégesis veterotestamentaria: Libros sapienciales',
            'Exégesis veterotestamentaria: Libros proféticos',
            'Filología veterotestamentaria: Análisis semántico',
            'Filología veterotestamentaria: Ecdótica (crítica textual)',
            'Abordajes exegéticos: Evaluación crítica de nuevas metodologías contemporáneas',
            'Abordajes exegéticos: Análisis narrativo o narratología en el AT',
            'Abordajes exegéticos: Estudios sobre intertextualidad',
            'Teología veterotestamentaria: El conflicto cósmico en el AT',
            'Teología veterotestamentaria: Teología bíblica del santuario',
            'Exégesis neotestamentaria: Epístolas paulinas (con especial énfasis en Romanos, Tesalonicenses y Hebreos)',
            'Exégesis neotestamentaria: Escritos joaninos (con especial énfasis en Apocalipsis)',
            'Filología neotestamentaria: Análisis semántico',
            'Filología neotestamentaria: Ecdótica',
            'Abordajes exegéticos: Evaluación crítica de nuevas metodologías contemporáneas',
            'Abordajes exegéticos: Análisis retórico',
            'Abordajes exegéticos: Análisis epistolográfico',
            'Teología neotestamentaria: El conflicto cósmico en el NT',
            'Teología neotestamentaria: Teología bíblica del santuario',
            'Teología fundamental: El método teológico',
            'Doctrina de Dios: Atributos y acciones divinas',
            'Doctrina de Dios: La Trinidad (unidad y pluralidad de Deidad)',
            'Doctrina de Dios: El lenguaje para hablar de Dios',
            'Doctrina de Dios: Dios y el santuario',
            'Eclesiología: Fundamentos y desafíos de la eclesiología adventista',
            'Eclesiología: Teología de la adoración y la música sacra',
            'Eclesiología: Teología de la predicación',
            'Teología y ética: Aportes del pensamiento teológico a los desafíos éticos contemporáneos',
            'Teología y ética: Ética y religión',
            'Teología y ética: Teología, religión y normativa',
            'Teología y ciencia: Epistemología de la Teología y de la religión',
            'Teología y ciencia: Historia de la ciencia teológica',
            'Teología y ciencia: Ciencia y religión',
            'Teología y filosofía: Pensamiento teológico latinoamericano, autores y corrientes relevantes de pensamiento',
            'Teología y filosofía: Pensamiento posmoderno y teología',
            'Teología y filosofía: Filosofía de la historia',
            'Teología y filosofía: Filosofía de la religión',
            'Teología y filosofía: Presuposiciones filosóficas en la teología',
            'Teología y sociología: Sociología de la religión',
            'Teología, política, derecho y sociedad: Fundamentalismos, fragmentación y movimientos geopolíticos religioso-culturales',
            'Teología, política, derecho y sociedad: Justicia social, derechos humanos e integración teológica en la realidad latinoamericana histórica y contemporánea',
            'Teología, política, derecho y sociedad: Interrelación entre Iglesia y Estado',
            'Teología histórica: Desarrollo de la doctrina del sábado',
            'Teología histórica: Desarrollo de la doctrina de la salvación en el adventismo',
            'Teología histórica: Teología y pensamiento de los padres prenicenos',
            'Historia eclesiástica: Los movimientos reavivalistas norteamericanos como trasfondo del movimiento millerita del siglo XIX',
            'Historia eclesiástica: Protestantismo latinoamericano',
            'Historia del adventismo sudamericano: Antecedentes históricos del adventismo en Sudamérica',
            'Historia del adventismo sudamericano: Personalidades destacadas del adventismo sudamericano',
            'Historia del adventismo sudamericano: Historia de las principales iglesias e instituciones de la IASD en Sudamérica',
            'El don profético y los escritos de Elena G. de White: La doctrina de la inspiración en los escritos de Elena G. de White',
            'El don profético y los escritos de Elena G. de White: Hermenéutica aplicada a los escritos de Elena G. de White',
            'Misiología y Crecimiento de iglesia: Teología de la misión',
            'Misiología y Crecimiento de iglesia: El crecimiento de la IASD en Argentina y Sudamérica',
            'Misiología y Crecimiento de iglesia: Estrategias de crecimiento de iglesia en el contexto latinoamericano',
            'Misiología y Crecimiento de iglesia: Misión urbana',
            'Misiología y Crecimiento de iglesia: Estrategias para plantar iglesias',
            'Misiología y Crecimiento de iglesia: Discipulado cristiano',
            'Misiología y Crecimiento de iglesia: Estrategias y métodos de evangelismo',
            'Misiología y Crecimiento de iglesia: Capacitación de laicos para el servicio misionero',
            'Teología y adoración: Teología de la adoración',
            'Teología y adoración: Teología y ministerio de la adoración',
            'Teología y adoración: Práctica de la música y adoración',
            'Teología y salud: Religiosidad y salud',
            'Teología y salud: Duelo',
            'Teología y salud: Esperanza y salud',
            'Teología y salud: Atención espiritual de pacientes terminales',
            'Teología y salud: Estilo de vida saludable',
            'Liderazgo pastoral: Fundamento bíblico teológico del liderazgo pastoral',
            'Liderazgo pastoral: Liderazgo de organizaciones eclesiásticas',
            'Liderazgo pastoral: Liderazgo espiritual',
            'Liderazgo pastoral: Modelos y estilos de liderazgo (Liderazgo servidor)',
            'Liderazgo pastoral: Los dones espirituales y el liderazgo',
            'Liderazgo pastoral: Administración de conflictos',
            'Liderazgo pastoral: Características del líder cristiano',
            'Liderazgo pastoral: Planificación estratégica',
            'Liderazgo pastoral: Misión y ministerios de la iglesia',
            'Hogar y familia: Educación religiosa de los hijos',
            'Hogar y familia: Relaciones afectivas',
            'Hogar y familia: Sistemas familiares',
            'Teología y educación: Incidencia de las corrientes teológicas contemporáneas en la conformación de la pedagogía actual',
            'Teología y educación: Evaluación crítica de las teorías pedagógicas contemporáneas en el marco de la cosmovisión cristiana',
            'Teología y educación: La transmisión de valores en los ámbitos de la educación teológica',
            'Teología y educación: Fundamentación teológica de la organización curricular y didáctica de la formación religiosa en los distintos niveles educacionales',
            'Teología y educación: Los fundamentos teológicos en relación con la educación popular',
            'Nuevas generaciones: Evangelismo para nuevas generaciones en entornos digitales',
            'Nuevas generaciones: Biblia, cultura y nuevas generaciones',
            'Nuevas generaciones: Narrativa bíblica y comunicación transmedia para nuevas generaciones',
            'Nuevas generaciones: Formación religiosa y transmisión de la fe en adolescentes',
        ]
}

const fields = [
    'Ciencias exactas y naturales',
    'Ingeniería y tecnología',
    'Ciencias médicas',
    'Ciencias agrícolas y veterinarias',
    'Ciencias sociales',
    'Humanidades y artes',
]

const objective = [
    'Exploración y explotación de la tierra',
    'Medio ambiente',
    'Exploración y explotación de espacio',
    'Transporte, telecomunicación y otras infraestructuras',
    'Energía',
    'Producción y tecnología industrial',
    'Salud',
    'Agricultura',
    'Educación',
    'Cultura, recreación, religión y medios de comunicación',
    'Estructuras, procesos y sistemas políticos y sociales',
]
const type = [
    'Investigación básica',
    'Investigación aplicada',
    'Desarrollo experimental',
]
