import { useState, useEffect } from "react";
import styles from "./About.module.css";

const ToolIntroSection = ({ goToNext }: {goToNext: () => void}) => (
        <div className={styles.introSectionMain}>
            <button className={styles.homeBtn}><a href="/"><i className={styles.arrowLeft}></i>Home</a></button>
            <div className={styles.introContent}>
                <div className={styles.headerContainer}>
                    <h1>About The</h1> 
                    <h1 className={styles.headerHighlight}>Creaters of GDDLab</h1>
                </div>
                <p className={styles.pageContent}>
                    GDDLab was made by the 2024 cohort of Global Development Design. 
                    The main goal of this collaboration system was to make team collaboration more seamless via kanban boards, 
                    a ticketing system, and shared schedules.
                    <br></br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
                </p>
            </div>
            <button className={styles.contentNav} onClick={goToNext}>
                <p>Meet GDD and Our Teams</p>
                <p><i className={styles.arrowDown}></i></p>
            </button>
        </div>
);

const GDDIntro = ({ goToPrev, goToNext }: { goToPrev: () => void, goToNext: () => void }) => (
    <div className={styles.section}>
        <div className={styles.slideGDDIntro}>
            <div className={styles.homeAndArrow}>
                <button className={styles.homeBtn}><a href="/"><i className={styles.arrowLeft}></i>Home</a></button>
                <button className={styles.contentNav} onClick={goToPrev}>
                    <p><i className={styles.arrowUp}></i></p>
                    <p>The Toolkit</p>
                </button>
            </div>

            <div className={styles.headerContainer}>
                    <h1>About</h1> 
                    <h1 className={styles.headerHighlight}>Global Development and Design</h1>
                </div>
            <p className={styles.pageContent}>
                GDD explores what ethical development around the world really means and needs. 
                Through this research, students contribute to creating an interactive, open-access,
                online toolkit that activists and professionals around the world can use to design social impact projects, 
                where each stage of the design process is infused with the imperatives of ethical, inclusive development. 
            </p>
            <button className={styles.contentNav} onClick={goToNext}>
                <p>Meet Our Teams</p>
                <p><i className={styles.arrowDown}></i></p>
            </button>
        </div>
    </div>
);

const CohortSlide = ({ cohorts, goToPrev, goToNext }: { cohorts: any, goToPrev: () => void, goToNext: () => void }) => {
    const years = cohorts.map((cohort: any) => cohort.year);
    const [currCohort, setCurrCohort] = useState(cohorts[0]["year"]);

    return (
        <div className={styles.cohortSlide}>
                <div className={styles.homeAndArrow}>
                    <button className={styles.homeBtn}><a href="/"><i className={styles.arrowLeft}></i>Home</a></button>
                    <button className={styles.contentNav} onClick={goToPrev}>
                        <p><i className={styles.arrowUp}></i></p>
                        <p>Meet GDD</p>
                    </button>
                </div>

            <div className={styles.cohortSlide}>
                {
                    cohorts.map((cohort: any) => {
                        return(
                            cohort.year === currCohort?
                            (<div className={styles.cohortInfoContainer}>
                                <h1 className={styles.cohortYearHeader}>{cohort.year} COHORT</h1>
                                <img src={cohort.image} alt="" className={styles.cohortImageContainer}/>
                                <div className={styles.membersContainer}>
                                    {cohort.members.map((member: string) => <p>{member}.&nbsp;</p>)}
                                </div>
                            </div>) : ('')
                        )
                    })

                }
                <div className={styles.yearsContainer}>
                    {years.map((year: number) => (
                        <button key={year} className={styles.yearBtn} onClick={() => setCurrCohort(year)}>
                            <p className={year === Number(currCohort)? styles.yearItemCurr : styles.yearItemHide}>
                                {year}
                            </p>
                        </button>
                    ))}
                </div>
                
            </div>
        </div>
    );
};

export type CohortProps = {
    year: number,
    image: string,
    members?: string[]
}

const About = () => {
    // const pages = [<ToolIntroSection />, <CohortSlide />];
    const [currentSlide, setCurrentSlide] = useState(1);
    const goToSlideA = () => setCurrentSlide(1);
    const goToSlideB = () => setCurrentSlide(2);
    const goToSlideC = () => setCurrentSlide(3);
    const [scrollPosition, setScrollPosition] = useState(0);
    // Will have to fetch this and pass it through the component
    const sampleCohort: CohortProps[] = [
        {
            year: 2020,
            image: '/assets/cohorts/2020Cohort.png',
            members: ["pookie wookie", "sookie lookie", "yookie mookie", "jookie", "vookie sookie", "dookie"]
        },
        {
            year: 2021,
            image: '/assets/cohorts/2021Cohort.png',
            members: ["pookie wookie", "sookie lookie", "yookie mookie", "jookie", "vookie sookie", "dookie"]
        },
        {
            year: 2022,
            image: '/assets/cohorts/2022Cohort2.JPG',
            members: ["pookie wookie", "sookie lookie", "yookie mookie", "jookie", "vookie sookie", "dookie"]
        },
        {
            year: 2023,
            image: '/assets/cohorts/2023Cohort (1).JPG',
            members: ["pookie wookie", "sookie lookie", "yookie mookie", "jookie", "vookie sookie", "dookie"]
        },
    ]

    // const handleScroll = () => {
    //     const position = window.pageYOffset;
    //     setScrollPosition(position);
    //     window.scrollTo({top: 100 + scrollPosition, behavior: 'smooth'});
    // };

    useEffect(() => {
        window.scrollTo({top: 100 + scrollPosition, behavior: 'smooth'});
    });

    return (
        <>
            <div className={styles.aboutMainContainer}>
                    {currentSlide === 1 && <ToolIntroSection goToNext={goToSlideB} />}
                    {currentSlide === 2 && <GDDIntro goToPrev={goToSlideA} goToNext={goToSlideC} />}
                    {currentSlide === 3 && <CohortSlide cohorts={sampleCohort} goToPrev={goToSlideB} goToNext={goToSlideA} />}

            </div>
        </>
       
    )
};

export default About;
