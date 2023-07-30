interface IShowStatus {
  status: number;
}
const ShowStatus = ({ status }: IShowStatus) => {
  return (
    <div>
      <div>true</div>
      <div>{status}</div>
    </div>
  );
};

export default ShowStatus;
