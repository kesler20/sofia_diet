import { IoIosArrowForward } from "react-icons/io";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import BasicModal from "./BasicModal";
import { useState } from "react";
import { NodeDataType } from "../../../../../../lib/src/types";
import {
  parseExcelFileContent,
  parseFileContent,
  parseFileName,
  parseModelInputsFromFileUpload,
} from "../../../../services";
import { CardDetail } from "../../DataStreamDesignerPage";
import UploadAFileCardComponent from "../../../../components/upload/UploadAFileCardComponent";

//------------------//
//                  //
//    COMPONENTS    //
//                  //
//------------------//

function CardButton(props: {
  buttonType: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDivClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  if (props.buttonType === "Create Card") {
    return (
      <button className="modal__card__btn--create mb-8" onClick={props.onClick}>
        <p className="mr-2">{props.buttonType}</p>
        <FaArrowUpRightFromSquare size={"13"} />
      </button>
    );
  } else if (props.buttonType === "Edit Card") {
    return (
      <button className="modal__card__btn--create mb-8" onClick={props.onClick}>
        <p className="mr-2">{props.buttonType}</p>
        <FaArrowUpRightFromSquare size={"13"} />
      </button>
    );
  } else if (props.buttonType === "Disabled") {
    return (
      <button className="modal__card__btn--disable mb-8">
        <p className="mr-2">Create Card</p>
        <FaArrowUpRightFromSquare size={"13"} />
      </button>
    );
  } else if (props.buttonType === "Add Stream") {
    return (
      <div
        onClick={props.onDivClick}
        className="
              flex justify-center items-center
              w-[38px] h-[38px]
              bg-gray-600
              rounded-full text-gray-200
              ml-2 mr-6
            "
      >
        <IoIosArrowForward size={20} />
      </div>
    );
  } else {
    return null;
  }
}

function SectionTitle(props: { title: string }) {
  return (
    <div className="flex w-full justify-start items-center text-gray-500">
      <div
        className="
              flex justify-center items-center
              w-[38px] h-[38px]
              bg-gray-600
              rounded-full text-gray-200
              ml-2 mr-6
            "
      >
        <IoIosArrowForward size={20} />
      </div>
      <p>{props.title}</p>
    </div>
  );
}

function SVGBackground() {
  return (
    <svg
      className="w-[100px] h-[100px] absolute top-[-7px] left-[-15px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="25" cy="25" r="5" fill="rgba(200, 200, 200,0.4)" />
      <circle cx="50" cy="25" r="10" fill="rgba(200, 200, 200,0.4)" />
      <circle cx="75" cy="25" r="15" fill="rgba(200, 200, 200,0.4)" />
      <circle cx="37.5" cy="50" r="7.5" fill="rgba(200, 200, 200,0.4)" />
      <circle cx="62.5" cy="50" r="12.5" fill="rgba(200, 200, 200,0.4)" />
      <circle cx="50" cy="75" r="10" fill="rgba(200, 200, 200,0.4)" />
    </svg>
  );
}

function CardContainer(props: {
  containerForm: React.ReactNode;
  onSubmitButtonClicked: any;
}) {
  return (
    <div
      className="
    flex items-center justify-center
    w-[350px] h-[450px]
    border-0.1 border-gray-200
    bg-white
    rounded-2xl shadow-xl"
    >
      <SVGBackground />
      <form
        className="flex items-center justify-center flex-col h-full"
        onSubmit={(e) => props.onSubmitButtonClicked(e)}
      >
        {props.containerForm}
      </form>
    </div>
  );
}

//------------------//
//                  //
//    MAIN CODE     //
//                  //
//------------------//

function CreateCard(props: {
  cardDetail: CardDetail;
  onSubmit: (card: NodeDataType) => void;
}) {
  const [card, setCard] = useState<NodeDataType>({
    cardName: "",
    version: 1,
    cardDetail: props.cardDetail,
    content: "",
    streamRate: 0,
    switchedOn: true,
    inputParams: [],
    outputParams: [],
  });

  const updateModelCardMetadata = async (e: File) => {
    // Update the input and output parameters of the card
    parseModelInputsFromFileUpload(e)
      .then((params) => {
        setCard((prevCard) => {
          return {
            ...prevCard,
            inputParams: params.inputs.map((input) => {
              return {
                name: input,
                values: [],
              };
            }),
            outputParams: params.outputs.map((output) => {
              return {
                name: output,
                values: [],
              };
            }),
          };
        });
      })
      .catch((e) => {
        console.error(e);
      });

    // Update the name of the card
    parseFileName(e)
      .then((fileName) => {
        setCard((prevCard) => {
          return {
            ...prevCard,
            cardName: fileName,
          };
        });
      })
      .catch((e) => {
        console.error(e);
      });

    // Update the content of the card
    parseFileContent(e).then((content) => {
      setCard((prevCard) => {
        return {
          ...prevCard,
          content: content as string,
        };
      });
    });
  };

  const updateDataSetCardMetadata = async (e: File) => {
    // Update the outputs of the data set card.
    parseExcelFileContent(e).then((params) => {
      setCard((prevCard) => {
        return {
          ...prevCard,
          outputParams: Object.keys(params).map((col) => {
            return {
              name: col,
              values: params[col],
            };
          }),
        };
      });
    });

    // Update the name of the card
    parseFileName(e).then((fileName) => {
      setCard((prevCard) => {
        return {
          ...prevCard,
          cardName: fileName,
        };
      });
    });
  };

  return (
    <CardContainer
      onSubmitButtonClicked={props.onSubmit}
      containerForm={
        <>
          <div className="mt-14 mb-10">
            <SectionTitle title={`${props.cardDetail} Name ?`} />
            <input
              className="
            text-center
            bg-transparent
            text-black
            ml-2"
              style={{
                border: "none",
                outline: "none",
                borderBottom: "1px solid rgb(193, 197, 204)",
              }}
              title="write-topic"
              type="text"
              placeholder={card.cardName}
              required
              onChange={(e) =>
                setCard((prevCard) => {
                  return {
                    ...prevCard,
                    cardName: e.target.value,
                  };
                })
              }
            />
          </div>

          {/* Card Body */}
          <UploadAFileCardComponent
            onClick={(file) => {
              if (file) {
                if (card.cardDetail === CardDetail.Model) {
                  updateModelCardMetadata(file);
                } else {
                  updateDataSetCardMetadata(file);
                }
              }
            }}
          />

          {/* Submit Button */}
          <CardButton
            buttonType="Create Card"
            onClick={() => {
              props.onSubmit(card);
            }}
          />
        </>
      }
    />
  );
}

// ------------------------------ //
//                                //
//       MODAL COMPONENT          //
//                                //
// ------------------------------ //

export default function CreateCardModal(props: {
  onSubmit: (card: NodeDataType) => void;
  open: boolean;
  cardDetail: CardDetail;
  onClose: () => void;
}) {
  return (
    <BasicModal
      open={props.open}
      customModal={
        <CreateCard onSubmit={props.onSubmit} cardDetail={props.cardDetail} />
      }
      handleClose={props.onClose}
    />
  );
}
