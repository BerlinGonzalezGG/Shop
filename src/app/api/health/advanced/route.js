import { NextResponse } from 'next/server';
import si from 'systeminformation';

export async function GET(request) {
  // Obtener el token del header Authorization
  const authorizationHeader = request.headers.get('authorization');
  
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization header missing or malformed' }, { status: 401 });
  }

  // Extraer el token del header
  const token = authorizationHeader.split(' ')[1];

  // Verificar si el token es válido
  if (token !== process.env.HEALTH_TOKEN) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Obtener las métricas del sistema
  const cpu = await si.currentLoad();
  const mem = await si.mem();
  const disk = await si.fsSize();

  return NextResponse.json({
    status: 'ok',
    cpuUsage: cpu.currentLoad,
    memoryUsage: {
      total: mem.total,
      free: mem.available,
    },
    diskUsage: disk,
  });
}
