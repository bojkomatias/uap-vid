
/** Checks how long does an investigation project lasts (returns an int, such int represents how long in YEARS) and what was the year in which the protocol was created. */
export function protocol_duration_helper(
    months_string: string,
    creation_date: Date | null
) {
    const months_string_dictionary = {
        '6 meses': 0.5,
        '12 meses': 1,
        '24 meses': 2,
        '36 meses': 3,
        '48 meses:': 4,
        '60 meses': 5,
    }

    const year = creation_date!.getFullYear()

    const duration =
        months_string_dictionary[
        months_string as keyof typeof months_string_dictionary
        ]

    const activeYears = () => {
        const years = []
        for (let i = 0; i < duration; i++) {
            years.push(year + i)
        }
        return years
    }

    return {
        duration_in_years: duration,
        creation_year: year,
        years_active: activeYears(),
    }
}