import MailForm from "@/components/forms/MailForm";

const maps_data = [
  { name: "Rozendale", stories: 4 },
  { name: "Tedesen", stories: 1 },
  { name: "Tenbrake", stories: 1 },
  { name: "Xing'er", stories: 10 },
  { name: "Crowlan", stories: 2 },
];

const MapsArea = () => {
  return (
    <div>
      <h1>Maps</h1>
      <div className="md:grid grid-cols-2 xl:grid-cols-4 gap-4">
        {maps_data.map((map) => (
          <div key={map.name} className="card">
            <h2>{map.name}</h2>
            <p>{map.stories} stories</p>
          </div>
        ))}
      </div>
      <MailForm />
    </div>
  );
};

export default MapsArea;
