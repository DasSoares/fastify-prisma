

export async function sleep(sec: number) {
  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve({ message: "Dados retornado com sucesso!" });
    }, sec * 1000)
  );
}
