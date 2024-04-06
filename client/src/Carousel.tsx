import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Task from './Task';

const MyCarousel = () => {

    const tasks = [
        {
            patient: "John Doe",
            time: "2:00 PM",
            details: "Basic checkup",
            materials: "Stethoscope, Thermometer, Blood Pressure Cuff, Gloves",
            location: "Room 203",
            notes: "Patient has a history of high blood pressure"
        },
        {
            patient: "Emily Smith",
            time: "3:00 PM",
            details: "X-Ray: Left Elbow",
            materials: "X-Ray Machine",
            location: "Room 332",
            notes: "Possible fracture"
        },
        {
            patient: "Michael Johnson",
            time: "10:00 AM",
            details: "Colonoscopy Preparation",
            materials: "Colonoscopy consent form",
            location: "Room 128",
            notes: ""
        },
        {
            patient: "Michael Johnson",
            time: "11:00 AM",
            details: "Colonoscopy Preparation",
            materials: "Colonoscopy consent form",
            location: "Room 128",
            notes: ""
        }
    ];

    return (
        <div className="inline-flex flex-col justify-center items-left pl-20">
            <p className="text-2xl mb-4 pl-6"><strong>Tasks</strong></p>
            <div className="border-2 border-gray-300 rounded-xl inline-flex">
                <Carousel className="items-left" 
                    opts={{
                        
                        loop: true,
                    }}>
                    <CarouselContent>
                        {tasks.map((task, index) => (
                        <CarouselItem key={index} className="basis-1/3 flex justify-left items-center pl-10">
                            <Task 
                                patient={task.patient} 
                                time={task.time} 
                                details={task.details}
                                materials={task.materials}
                                location={task.location}
                                notes={task.notes} />
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious>Previous</CarouselPrevious>
                    <CarouselNext>Next</CarouselNext>
                </Carousel>
            </div>
        </div>
        

    )
    

}

export default MyCarousel;
