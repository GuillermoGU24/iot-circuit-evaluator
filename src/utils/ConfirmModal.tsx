import { motion, AnimatePresence } from "framer-motion";

type ConfirmModalProps = {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  show,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white border border-gray-200 rounded-3xl shadow-2xl p-12 w-full max-w-2xl text-center space-y-10"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Icono */}
            <div className="flex justify-center">
              <div className="bg-yellow-100 text-yellow-600 p-6 rounded-full shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M10.29 3.86l-7.4 12.84A1.5 1.5 0 004.21 19h15.58a1.5 1.5 0 001.32-2.3l-7.4-12.84a1.5 1.5 0 00-2.62 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Título */}
            <h2 className="text-3xl font-bold text-gray-900">
              ¿Finalizar intento?
            </h2>

            {/* Texto */}
            <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
              Si confirmas, se mostrará tu{" "}
              <span className="font-semibold text-gray-800">
                calificación final
              </span>
              . Una vez finalices,{" "}
              <span className="text-red-600 font-semibold">
                no podrás volver atrás
              </span>
              .
            </p>

            {/* Botones */}
            <div className="flex justify-center gap-8 pt-6">
              <button
                onClick={onCancel}
                className="px-8 py-4 rounded-xl text-lg font-medium text-gray-600 border border-gray-300 hover:bg-gray-100 transition shadow-sm"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-8 py-4 rounded-xl text-lg font-semibold text-white bg-green-600 hover:bg-green-700 shadow-lg transition"
              >
                Terminar intento
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
