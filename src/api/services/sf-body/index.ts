const prepareBody = (data = {}): string => {
  const dataArray = Object.entries(data);
  return Object.entries(data)
    .map((val, ind) =>
      ind === dataArray.length - 1
        ? `${val[0]}=${encodeURIComponent(val[1] as string)}`
        : `${val[0]}=${encodeURIComponent(val[1] as string)}&`
    )
    .join('');
};

export default prepareBody;
