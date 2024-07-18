interface DescriptionsModalProps {
  descriptions: string;
  onClose: () => void;
}

export function DescriptionsModal({
  descriptions,
  onClose,
}: DescriptionsModalProps) {
  const descriptionsArray = descriptions.split(", ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-800 opacity-75"></div>
      <div className="relative w-6/12 mx-auto my-6">
        {/* Modal content */}
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none max-h-screen">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
            <h3 className="text-xl font-semibold">Descriptions</h3>
            <button
              type="button"
              className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="text-black opacity-50">×</span>
            </button>
          </div>
          {/* Body */}
          <div
            className="relative p-6 flex-auto space-y-4 overflow-y-auto"
            style={{ maxHeight: "60vh" }}
          >
            {descriptionsArray.map((desc, index) => (
              <div key={index} className="p-2 border-b">
                <p className="text-lg font-medium">Description {index + 1}</p>
                <p className="text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
            <button
              type="button"
              className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
