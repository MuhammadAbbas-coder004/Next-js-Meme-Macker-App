import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const template_id = formData.get('template_id') as string;
  const texts = formData.getAll('texts') as string[];

  const params = new URLSearchParams();
  params.append('template_id', template_id);
  params.append('username', 'mabbas123');
  params.append('password', 'mabbas123');
  texts.forEach((text, i) => {
    params.append(`boxes[${i}][text]`, text);
  });

  const response = await fetch('https://api.imgflip.com/caption_image', {
    method: 'POST',
    body: params,
  });

  const data = await response.json();
  return NextResponse.json(data);
}