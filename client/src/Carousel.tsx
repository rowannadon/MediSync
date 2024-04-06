import {

  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Task from './Task';
import { Card } from './components/ui/card';


const MyCarousel = () => {
  const tasks = [
    {
      time: '2:00 PM',
      details: 'Basic checkup',
      materials: 'Stethoscope, Thermometer, Blood Pressure Cuff, Gloves',
      location: 'Room 203',
      notes: 'Patient has a history of high blood pressure',
      patient: 'John Doe',
    },
    {
      time: '3:00 PM',
      details: 'X-Ray: Left Elbow',
      materials: 'X-Ray Machine',
      location: 'Room 332',
      notes: 'Possible fracture',
      patient: 'Emily Smith',
    },
    {
      time: '10:00 AM',
      details: 'Colonoscopy Preparation',
      materials: 'Colonoscopy consent form',
      location: 'Room 128',
      notes: '',
      patient: 'Michael Johnson',
    },
  ];


  return (
    <Card className="m-2 flex flex-grow flex-col items-center justify-center p-4">
      <p className="mb-4 text-4xl">
        <strong>Tasks</strong>
      </p>
      <div className="flex flex-grow flex-col  items-center justify-center pl-60 pr-60">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="flex flex-grow flex-col items-center justify-center"
        >
          <CarouselContent className="flex flex-1">
            {tasks.map((task, index) => (
              <CarouselItem key={index} className="flex flex-grow ">
                <Card className="flex flex-grow flex-row items-center justify-start p-8">
                  <Task
                    time={task.time}
                    details={task.details}
                    materials={task.materials}
                    location={task.location}
                    notes={task.notes}
                    patient={task.patient}
                  />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious>Previous</CarouselPrevious>
          <CarouselNext>Next</CarouselNext>
        </Carousel>
      </div>
    </Card>
  );
};


export default MyCarousel;
