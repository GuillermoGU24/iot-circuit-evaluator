type Props = { score: number };

export default function ScoreBoard({ score }: Props) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold">Puntaje</h2>
      <p className="text-2xl text-blue-600">{score}</p>
    </div>
  );
}
