export interface ModalPropsType<T extends object> {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    data: T | null;
}
