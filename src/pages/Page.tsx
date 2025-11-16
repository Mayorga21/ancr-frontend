export default function Page({ title }:{ title:string }){
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="opacity-80 mt-2">Contenido de {title}.</p>
    </div>
  );
}
