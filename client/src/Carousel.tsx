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
            time: "2:00 PM",
            details: "Basic checkup",
            materials: "Stethoscope, Thermometer, Blood Pressure Cuff, Gloves",
            location: "Room 203",
            notes: "Patient has a history of high blood pressure",
            patient: "John Doe"
        },
        {
            time: "3:00 PM",
            details: "X-Ray: Left Elbow",
            materials: "X-Ray Machine",
            location: "Room 332",
            notes: "Possible fracture",
            patient: "Emily Smith"
        },
        {
            time: "10:00 AM",
            details: "Colonoscopy Preparation",
            materials: "Colonoscopy consent form",
            location: "Room 128",
            notes: "",
            patient: "Michael Johnson"
        }
    ];

    return (
        <div className="inline-flex flex-col justify-center items-center pl-20">
            <p className="text-4xl mb-4"><strong>Tasks</strong></p>
            <div className="border-2 border-gray-300 rounded-lg">
                <Carousel 
                opts={{
                    align: "center",
                    loop: true,
                }}>
                  <CarouselContent className="items-center">
                    {tasks.map((task, index) => (
                      <CarouselItem key={index} className="flex justify-center items-center">
                        <Task 
                            time={task.time} 
                            details={task.details}
                            materials={task.materials}
                            location={task.location}
                            notes={task.notes}
                            patient={task.patient} />
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
