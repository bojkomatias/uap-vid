// The purpose of this file is to have the descriptions separated from metadata, and also, not bother with format typing, since it return jsx, such is more flexible than say plain string

// Estan en orden asi que corroborar, hay uno por cada seccion.

export const Helpers = [
    {
        fn: (props) => (
            <div {...props}>
                <p>
                    <b>Codirector:</b> En el caso de un proyecto tesis de
                    posgrado, agregar el nombre del director o consejero.
                </p>
                <p>
                    {' '}
                    <b>Investigadores externos UAP:</b> Colaboradores adhonorem{' '}
                </p>
                <p>
                    {' '}
                    <b>Técnico y Profesionales:</b> Después de que el proyecto
                    sea aprobado y asignados los técnicos y los profesionales
                    becados, deberá adjuntar un archivo para justificar la
                    participación y detallar exhaustivamente las actividades que
                    llevará a cabo cada uno, junto con: Conocimientos previos
                    requeridos. Datos personales: apellido y nombre, tipo y
                    número de documento, dirección de correo electrónico y
                    dirección postal. Estudios: cantidad de asignaturas
                    regularizadas y aprobadas de la carrera en curso o título de
                    las carreras de grado o posgrado terminadas. Cursos
                    realizados. Becas obtenidas anteriormente. Idiomas: con qué
                    idiomas puede trabajar y con qué nivel en cada caso. Carta
                    escrita por el postulante en la que fundamente la solicitud
                    de la beca.
                </p>
            </div>
        ),
    },
    {
        fn: (props) => (
            <div {...props}>
                La duración de 60 meses solo será aplicable a proyectos
                vinculados con programas doctorales
            </div>
        ),
    },

    {
        fn: (props) => (
            <div {...props}>
                Debe detallar todos los insumos y sus costos. Aquellos insumos
                que fueren adquiridos a través del presupuesto asignado por la
                UAP, una vez concluido el proyecto, deberán ser entregados en la
                VID para que esta defina el destino que se les dará.
                <p>
                    Recuerde que, al solicitar reintegros por gastos directos de
                    investigación, se aprobarán solo aquellos que figuren en el
                    presupuesto que presente en este protocolo, por lo que se
                    solicita que detalle de manera exhaustiva los rubros que
                    considere pertinentes, por ejemplo: insumos de laboratorio,
                    libros, fotocopias, materiales de impresión, correo postal,
                    artículos de librería, papelería, viajes, test,
                    traducciones, publicación, etc.
                </p>{' '}
                <p>
                    Para tener derecho al reembolso de cualquier otro gasto que
                    no esté contemplado dentro del presupuesto original, deberá
                    presentar la solicitud al secretario de investigación de la
                    unidad académica para que este gestione la autorización de
                    la Vicerrectoría de Investigación y Desarrollo. Si el
                    investigador efectuara el gasto sin contar con dicha
                    autorización, no podrá exigir su reembolso.
                </p>
            </div>
        ),
    },
    { fn: (props) => <div {...props}> </div> },
]
